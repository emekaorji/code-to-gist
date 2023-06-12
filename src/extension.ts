import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "code-to-gist.createGist",
    async () => {
      const token = await vscode.window.showInputBox({
        prompt: "Token",
      });

      if (!token) {
        vscode.window.showErrorMessage(
          "Token"
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

      const gists = filesToUpload.map(async (fileUri) => {
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

        return {
          filename: fileName,
          content: fileContent,
        };
      });

      try {
        const response = await axios.post(
          "https://api.github.com/gists",
          {
            files: gists,
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
        vscode.window.showErrorMessage(`Failed to create a gist: ${e.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
