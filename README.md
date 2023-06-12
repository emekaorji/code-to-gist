![Code-to-Gist Logo](https://i.ibb.co/JzGq3YD/Code-To-Gist-logos-copy.jpg)

## Code-to-Gist 🤖

This extension allows you to conveniently create and share GitHub Gists from your code files directly within the editor. Gists are a way to share snippets or larger portions of code with others, either as a public or secret gist, making it easy to collaborate or showcase your work.

### Features 📙

- Create GitHub Gists: Create Gists by posting code files from your local VS Code environment to GitHub's Gist service.

- GitHub PAT: To authenticate with GitHub and create Gists, you'll need to provide a GitHub PAT (Personal Access Token), ensuring secure and authorized access, you can get that via your GitHub profile settings.

- File Selection: Choose specific code files to include in the Gist by selecting them through the file picker within the VS Code interface.

- Public or Private Gists: You can decide whether your Gist should be public or private, allowing you to control who can access and view your code snippets for safer collaboration.

### Installation 📝

1. Launch Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the left sidebar or by using the shortcut `Ctrl+Shift+X`.
3. Search for "Code-to-Gist" in the Extensions marketplace.
4. Click the "Install" button next to the "Code-to-Gist" extension.
5. Once installed, you can find the extension using `Cmd+Shift+P` or at the bottom left of your VSCode as `Create Gist`

### Usage 🛠️

1. Open Visual Studio Code and open a workspace folder.
2. Click on the "Create Gist" button located on the status bar at the bottom left of your window.
3. If you're not already authenticated with GitHub in your VSCode session, a prompt will appear asking for GitHub authentication. Log in to your GitHub account.
   - If you encounter any issues with GitHub authentication, refer to the **#Troubleshooting** section of this page.
4. Upon successful authentication, a file picker will open up, allowing you to select one or multiple code files to include in the Gist. You can select multiple files using `Cmd + Click`.
5. Confirm your selection of the desired files.
6. A prompt will appear asking you to select the visibility of the Gist. Choose either 'public' or 'secret'.
7. The extension will handle the creation of the Gist and display a success message with the URL of the created Gist at the bottom right corner of your code editor.
8. If you choose to go to the Gist, it will open up in your default browser.
9. In case of any errors or issues, appropriate error messages will be displayed, indicating the problem encountered. Refer to the **#Troubleshooting** section of this docs and try to fix the issue based on the error message. If the error persists, please reach out to me via Twitter DM (@developerayo).

Please note, you can also use the `Cmd+Shift+P` shortcut or navigate to the "View" menu and select "Command Palette", then search for `"Code-To-Gist: Create GitHub Gist from VSCode"` to activate the extension, just in-case you prefer this method :)

### Extension Deactivation 😔

The extension is deactivated automatically when you close Visual Studio Code or manually disable the extension in the Extensions view.

### Troubleshooting 🐛

- **Error: "GitHub authentication failed"**: Ensure that you are successfully authenticated with your GitHub account in your VSCode session. If not, the Code-To-Gist extension cannot authenticate and create Gists.
- **Error: "Please select a file"**: Make sure you select at least one code file to include in the Gist when the file picker opens. You can select multiple files by using `Cmd + Click`.
- **Error: "Rate limit exceeded. Please try again later."**: GitHub imposes rate limits on API requests. If you encounter this error, you'll have to wait for some time before trying to create a new Gist again.
- **Error: "Invalid GitHub PAT. Please check your token."**: This error should not appear unless there is a change in the GitHub authentication method provided by VSCode. If you do encounter it, verify that you're properly authenticated on your VSCode session.
- **Error: "Please select a gist visibility"**: Make sure to select either 'public' or 'secret' when asked for the visibility of the Gist.
- **Error: "Failed to create a gist: [Error Message]" or "An unexpected error occurred while creating a gist"**: These are general error messages. Look at the provided error details for hints on what went wrong. If the error persists, reach out for help via Twitter DM (@developerayo).

### Feedback and Contributions 👂

If you have any feedback, suggestions, or bug reports, please reach out to me on Twitter (@developerayo)

**Enjoy!** 🧡
