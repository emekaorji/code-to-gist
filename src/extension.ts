import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "code-to-gist.createGist",
    async () => {
      const token = await vscode.window.showInputBox({
        placeHolder: "Enter your GitHub PAT",
        password: true,
        prompt:
          "Your GitHub Personal Access Token is required to create a Gists",
      });

      if (!token) {
        vscode.window.showErrorMessage(
          "GitHub Personal Access Token is required"
        );
        return;
      }

      const filesToUpload = await vscode.window.showOpenDialog({
        canSelectMany: true,
        canSelectFolders: false,
      });

      if (!filesToUpload) {
        vscode.window.showErrorMessage("Please select a file");
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
            public: true,
          },
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        );

        if (response.status === 201) {
          vscode.window.showInformationMessage(
            `Gist Created: ${response.data.html_url}`
          );
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
