import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "code-to-gist.createGist",
    async () => {
      const session = await vscode.authentication.getSession(
        "github",
        ["gist"],
        { createIfNone: true }
      );
      if (!session) {
        vscode.window.showErrorMessage("GitHub authentication failed");
        return;
      }
      const token = session.accessToken;

      const filesToUpload = await vscode.window.showOpenDialog({
        canSelectMany: true,
        canSelectFolders: false,
      });

      if (!filesToUpload) {
        vscode.window.showErrorMessage("Please select a file");
        return;
      }

      const gistVisibility = await vscode.window.showQuickPick(
        ["public", "secret"],
        {
          placeHolder: "Choose the gist visibility",
        }
      );

      if (!gistVisibility) {
        vscode.window.showErrorMessage("Please select a gist visibility");
        return;
      }

      const gists: any[] = [];
      for (const fileUri of filesToUpload) {
        const fileName = fileUri.path.split("/").pop() || "";

        let fileContent;
        try {
          fileContent = fs.readFileSync(fileUri.fsPath, "utf8");
        } catch (e) {
          vscode.window.showErrorMessage(
            `Failed to read the file: ${fileName}`
          );
          throw e;
        }

        gists.push({
          [fileName]: {
            content: fileContent,
          },
        });
      }

      try {
        const response = await axios.post(
          "https://api.github.com/gists",
          {
            files: Object.assign({}, ...gists),
            public: gistVisibility === "public",
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
            vscode.window.showErrorMessage(
              `Failed to create a gist: ${e.message}`
            );
          }
        } else {
          vscode.window.showErrorMessage(
            "An unexpected error occurred while creating a gist"
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
