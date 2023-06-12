# Change Log

## Version 0.2.1 (Current)
### Added
- Added support for creating gists from multiple files selected in the file picker.
- Added a status bar item to easily create a Gist from the selected files without needing to use the command palette.
- Added VSCode session based GitHub authentication. You no longer need to manually input your GitHub Personal Access Token (PAT).

### Changed
- Removed the need for manual GitHub Personal Access Token (PAT) input. The extension now leverages VSCode's GitHub session for authentication.

### Fixed
- Enhanced error handling for cases like rate limit exceeded, invalid GitHub session and general errors while creating a gist.

## Version 0.1.0
### Added
- Introduced a command palette-based interface for creating Gists.
- Provided support for creating public and private gists.

### Changed
- Enhanced error handling to provide more helpful and precise error messages.

### Fixed
- Fixed minor bugs related to GitHub PAT input and handling.

## Version 0.0.1 (Initial Release)
- Initial release of the extension. Functionality included the ability to create gists from active code file in Visual Studio Code.