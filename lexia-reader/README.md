# LEXIA

**LEXIA AI Assistant for Visual Studio Code**

LEXIA is an AI-powered coding assistant designed to help developers understand, analyse, and improve their code directly within VS Code.

## Features

- **Code Analysis:** Analyse the currently open file.
- **AI Assistance:** Ask questions about your code and receive explanations.
- **Bug Identification:** Identify potential issues and areas for improvement.
- **Readable Responses:** Receive structured explanations and code examples.

## Requirements

- Visual Studio Code
- An active internet connection
- Access to the LEXIA AI backend

## Usage

1. Open LEXIA from the Activity Bar.
2. Open a source-code file.
3. Use the LEXIA interface to analyse your file or ask a question.
4. Review the AI-generated explanation and suggestions.

## AI Backend

LEXIA connects to its hosted backend:

`https://lexia-api-v2.onrender.com/ask`

## About

LEXIA is developed by Michael James Soria.

#install vscode/vsce
npm install --save-dev @vscode/vsce


#download the file
npx vsce package or vsce package


#install the .vsix file
code --install-extension lexia-reader-0.0.1.vsix
