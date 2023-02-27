# Editor integration

- [Visual Studio Code](#visual-studio-code)
  - [Configuration for vscode](#configuration-for-vscode)
- [Lunarvim](#lunarvim)
  - [Configuration for lvim](#configuration-for-lvim)
- [FAQ](#faq)

## Visual Studio Code

This project is best developed in VS Code. With the [recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) and settings in `.vscode`, you get:

- Syntax highlighting for all files
- Intellisense for all files
- Lint-on-save for all files
- In-editor results on save for unit tests

### Configuration for vscode

To configure

- `.vscode/extensions.json`
- `.vscode/settings.json`

## Lunarvim

Lunarvim aka lvim is not a bad choice. With the [recommended config](https://github.com/boydaihungst/.config/edit/master/README.md#install-neovim-090-and-lvim) of mine:

- Syntax highlighting for all files
- Intellisense for all files
- Lint for all files
- In-editor results on save for unit tests

### Configuration for lvim

To configure

- `.nlsp-settings/volar.json`
- `.nlsp-settings/tsserver.json`
- `$HOME/.config/lvim/`

## FAQ

**What kinds of editor settings and extensions should be added to the project?**

All additions must:

- be specific to this project
- not interfere with any team member's workflow

For example, an extension to add syntax highlighting for an included language will almost certainly be welcome, but a setting to change the editor's color theme wouldn't be appropriate.
