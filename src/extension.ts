import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

interface Gist {
  [key: string]: { content: string };
}

const getSessionToken = async () => {
  const session = await vscode.authentication.getSession("github", ["gist"], {
    createIfNone: true,
  });
  if (!session) {
    throw new Error("GitHub authentication failed");
  }

  return session.accessToken;
};

const getGistVisibility = async () => {
  const gistVisibility = await vscode.window.showQuickPick(
    ["public", "secret"],
    {
      placeHolder: "Choose the gist visibility",
    }
  );
  if (!gistVisibility) {
    throw new Error("Please select a gist visibility");
  }

  return gistVisibility === "public";
};

const readFilesRecursively = (filePath: string | undefined) => {
  const gists: Gist[] = [];
  if (!filePath) {
    return gists;
  }
  const isMultiple = fs.statSync(filePath).isDirectory();

  const _readFilesRecursively = (_filePath: string) => {
    if (_filePath.split("/").pop() === "node_modules") {
      vscode.window.showInformationMessage(
        "Can't create a gist from node_modules"
      );
      return;
    }
    const isFile = !fs.statSync(_filePath).isDirectory();

    const readSingleFile = (__filePath: string) => {
      const fileName = __filePath.split("/").pop() || "";
      const fileContent = fs.readFileSync(__filePath, "utf8");

      if (!isMultiple) {
        vscode.window.showInformationMessage(`Read file ${fileName}`);
      }

      gists.push({
        [fileName]: {
          content: fileContent,
        },
      });
    };

    if (isFile) {
      readSingleFile(_filePath);
      return;
    }

    const files = fs.readdirSync(_filePath);

    files.forEach((file) => {
      const itemPath = path.join(_filePath, file);

      const isDirectory = fs.statSync(itemPath).isDirectory();

      if (isDirectory) {
        _readFilesRecursively(itemPath);
        vscode.window.showInformationMessage(`Read multiple files...`);
      } else {
        readSingleFile(itemPath);
      }
    });
  };

  _readFilesRecursively(filePath);

  return gists;
};

const uploadGistAndHandleErrors = async (
  gists: Gist[],
  isPublic: boolean,
  token: string
) => {
  try {
    const response = await axios.post(
      "https://api.github.com/gists",
      {
        files: Object.assign({}, ...gists),
        public: isPublic,
      },
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    if (response.status === 201) {
      const gistUrl = response.data.html_url;
      const openGistButton = "Go to Gist";
      const selectedButton = await vscode.window.showInformationMessage(
        `Gist Created: ${gistUrl}`,
        openGistButton
      );
      if (selectedButton === openGistButton) {
        vscode.env.openExternal(vscode.Uri.parse(gistUrl));
      }
    } else {
      throw new Error(
        `GitHub API responded with status code ${response.status}`
      );
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 403) {
        vscode.window.showErrorMessage(
          "Rate limit exceeded. Please try again later."
        );
      } else if (e.response?.status === 401) {
        vscode.window.showErrorMessage(
          "Invalid GitHub PAT. Please check your token."
        );
      } else {
        vscode.window.showErrorMessage(`Failed to create a gist: ${e.message}`);
      }
    } else {
      vscode.window.showErrorMessage(
        (e as string) || "An unexpected error occurred while creating a gist"
      );
    }
  }
};

const createGistFromActiveEditor = async () => {
  const token = await getSessionToken();

  const activeDocument = vscode.window.activeTextEditor?.document;
  const activeEditorFileName = activeDocument?.fileName.split("/").pop() || "";
  const activeEditorFileContent = activeDocument?.getText() || "";

  if (!activeEditorFileName || !activeEditorFileContent) {
    throw new Error("Please open a file in editor");
  }

  const isPublic = await getGistVisibility();

  const gists: Gist[] = [];
  gists.push({
    [activeEditorFileName]: {
      content: activeEditorFileContent,
    },
  });

  return uploadGistAndHandleErrors(gists, isPublic, token);
};

const createGistFromExplorer = async (uri: vscode.Uri | undefined) => {
  const token = await getSessionToken();

  const gists = readFilesRecursively(uri?.fsPath);

  if (gists.length < 1) {
    throw new Error("Select a valid file or folder from the vscode explorer");
  }

  const isPublic = await getGistVisibility();

  return uploadGistAndHandleErrors(gists, isPublic, token);
};

const createGistFromFilePicker = async () => {
  const token = await getSessionToken();

  const filesToUpload = await vscode.window.showOpenDialog({
    canSelectMany: true,
    canSelectFolders: false,
  });

  if (!filesToUpload) {
    throw new Error("Please select a file");
  }

  const gists: Gist[] = [];
  for (const fileUri of filesToUpload) {
    const fileName = fileUri.path.split("/").pop() || "";

    let fileContent;
    try {
      fileContent = fs.readFileSync(fileUri.fsPath, "utf8");
    } catch (e) {
      vscode.window.showErrorMessage(`Failed to read the file: ${fileName}`);
      throw e;
    }

    gists.push({
      [fileName]: {
        content: fileContent,
      },
    });
  }

  const isPublic = await getGistVisibility();

  return uploadGistAndHandleErrors(gists, isPublic, token);
};

const createGistFromSelection = async () => {
  const token = await getSessionToken();

  const activeEditor = vscode.window.activeTextEditor;
  const activeEditorFileName =
    activeEditor?.document.fileName.split("/").pop() || "";
  const selectedTextContent =
    (activeEditor && activeEditor.document.getText(activeEditor.selection)) ||
    "";

  if (!activeEditorFileName || !selectedTextContent) {
    throw new Error("Please select some text to create gist");
  }

  const isPublic = await getGistVisibility();

  const gists: Gist[] = [];
  gists.push({
    [activeEditorFileName]: {
      content: selectedTextContent,
    },
  });

  return uploadGistAndHandleErrors(gists, isPublic, token);
};

export async function activate(context: vscode.ExtensionContext) {
  const createGistFromActiveEditorDisposable = vscode.commands.registerCommand(
    "code-to-gist.createGistFromActiveEditor",
    createGistFromActiveEditor
  );
  const createGistFromExplorerDisposable = vscode.commands.registerCommand(
    "code-to-gist.createGistFromExplorer",
    createGistFromExplorer
  );
  const createGistFromFilePickerDisposable = vscode.commands.registerCommand(
    "code-to-gist.createGistFromFilePicker",
    createGistFromFilePicker
  );
  const createGistFromSelectionDisposable = vscode.commands.registerCommand(
    "code-to-gist.createGistFromSelection",
    createGistFromSelection
  );

  context.subscriptions.push(createGistFromActiveEditorDisposable);
  context.subscriptions.push(createGistFromExplorerDisposable);
  context.subscriptions.push(createGistFromFilePickerDisposable);
  context.subscriptions.push(createGistFromSelectionDisposable);

  let myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    1
  );
  myStatusBarItem.command = "code-to-gist.createGistFromFilePicker";
  myStatusBarItem.text = `$(file-code) Create Gist`;
  myStatusBarItem.tooltip = "Create Gist";

  context.subscriptions.push(myStatusBarItem);

  myStatusBarItem.show();
}

export function deactivate() {}
