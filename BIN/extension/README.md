# LEXIA

**LEXIA is an AI coding assistant for Visual Studio Code.**

LEXIA allows developers to ask questions directly inside VS Code and receive AI-powered responses without leaving their development environment.

## Features

- Ask LEXIA programming and development questions
- AI responses directly inside the VS Code sidebar
- Supports natural-language questions
- Copy AI responses with one click
- Enter to send messages
- Shift + Enter for a new line
- Clean VS Code-integrated interface

## How It Works

LEXIA uses a VS Code extension connected to the LEXIA AI backend.

```text
VS Code
   ↓
LEXIA Extension
   ↓
LEXIA API
   ↓
AI Provider
   ↓
LEXIA Response







## Developer Access ##

Clone the repository and build the VSIX extension:

```bash
git clone https://github.com/JAMES22308/LEXIA-v2.git
cd LEXIA-v2/extension
npm install
vsce package
```

This generates the `lexia-0.0.1.vsix` file.

Install the extension in VS Code:

```bash
code --install-extension lexia-0.0.1.vsix
```

Then open VS Code and click the **LEXIA** icon in the Activity Bar.
