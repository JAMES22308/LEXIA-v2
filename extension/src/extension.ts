import * as vscode from 'vscode';

import { LexiaViewProvider } from './lexiaViewProvider';


export function activate(
    context: vscode.ExtensionContext
) {

    console.log(
        'LEXIA extension is now active.'
    );


    const provider =
        new LexiaViewProvider(context);


    context.subscriptions.push(

        vscode.window.registerWebviewViewProvider(
            'lexia.chat',
            provider
        )

    );


    const disposable =
        vscode.commands.registerCommand(
            'lexia.helloWorld',
            () => {

                vscode.window.showInformationMessage(
                    'Hello World from LEXIA!'
                );

            }
        );


    context.subscriptions.push(
        disposable
    );
}


export function deactivate() {}