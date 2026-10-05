import * as vscode from 'vscode';
import { LexiaViewProvider } from './lexiaViewProvider';

export function activate(context: vscode.ExtensionContext) {

    console.log('LEXIA extension is now active.');

    // Create the LEXIA sidebar provider
    const provider =
        new LexiaViewProvider();

    // Register LEXIA sidebar
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'lexia.chat',
            provider
        )
    );

    // Keep the original Hello World command
    const disposable =
        vscode.commands.registerCommand(
            'lexia.helloWorld',
            () => {

                vscode.window.showInformationMessage(
                    'Hello World from LEXIA!'
                );

            }
        );

    context.subscriptions.push(disposable);
}

export function deactivate() {}