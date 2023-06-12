![Code-to-Gist Logo](https://i.ibb.co/JzGq3YD/Code-To-Gist-logos-copy.jpg)

## Code-to-Gist 🤖 🛠️

This extension allows you to conveniently create and share GitHub Gists from your code files directly within the editor. Gists are a way to share snippets or larger portions of code with others, either as a public or secret gist, making it easy to collaborate or showcase your work.

### Features
- Create GitHub Gists: Create Gists by posting code files from your local VS Code environment to GitHub's Gist service.

- GitHub PAT: To authenticate with GitHub and create Gists, you'll need to provide a GitHub PAT (Personal Access Token), ensuring secure and authorized access, you can get that via your GitHub profile settings.

- File Selection: Choose specific code files to include in the Gist by selecting them through the file picker within the VS Code interface.

- Public or Private Gists: You can decide whether your Gist should be public or private, allowing you to control who can access and view your code snippets for safer collaboration.

### Installation
1. Launch Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the left sidebar or by using the shortcut `Ctrl+Shift+X`.
3. Search for "Code-to-Gist" in the Extensions marketplace.
4. Click the "Install" button next to the "Code-to-Gist" extension.
5. Once installed, you can find the extension in the Extensions sidebar.

### Usage
1. Open a code file or workspace in Visual Studio Code.
2. Click on the Command Palette by using the shortcut `Ctrl+Shift+P` or by navigating to the "View" menu and selecting "Command Palette".
3. In the Command Palette, search for "Code-To-Gist: Create GitHub Gist from VSCode" and select the command.
4. A prompt will appear asking for your GitHub PAT. Enter your Personal Access Token and press Enter.
   - If you don't have a GitHub PAT.
5. After providing the PAT, a file picker modal will open-up, allowing you to select the code files to include in the Gist.
6. Choose the desired files and confirm your selection.
7. Select whether the Gist should be public or private.
8. The extension will handle the creation of the Gist and display a success message with the URL of the created Gist at the bottom right corner of your code editor.
9. In case of any errors or issues, appropriate error messages will be displayed, indicating the problem encountered, read the **#Troubleshooting** section of this page and try to fix based on the error message if the error persist please reach out to me via Twitter DM (@developerayo).

### Extension Deactivation
The extension is deactivated automatically when you close Visual Studio Code or manually disable the extension in the Extensions view.

### Troubleshooting
- **Error: "GitHub Personal Access Token is required"**: Ensure that you provide a valid GitHub Personal Access Token. Without it, the extension cannot authenticate and create Gists.
- **Error: "Please select a file"**: Make sure you select at least one code file to include in the Gist using the file picker modal.
- **Error: "Rate limit exceeded. Please try again later."**: GitHub imposes rate limits on API requests. If you encounter this error, wait for some time before creating a new Gist.
- **Error: "Invalid GitHub PAT. Please check your token."**: Verify that the provided GitHub Personal Access Token is correct and has the necessary permissions to create Gist.

### Feedback and Contributions
If you have any feedback, suggestions, or bug reports, please reach out to me on Twitter (@developerayo)

**Enjoy!**
