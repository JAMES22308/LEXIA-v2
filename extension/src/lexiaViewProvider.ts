import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { askLexia } from './lexiaApi';
import { getWebviewHtml } from './webview/index';


export class LexiaViewProvider
    implements vscode.WebviewViewProvider {


    constructor(
        private readonly context: vscode.ExtensionContext
    ) {}


    resolveWebviewView(
        webviewView: vscode.WebviewView
    ): void {

        webviewView.webview.options = {
            enableScripts: true
        };


        // Receive messages from the Webview
        webviewView.webview.onDidReceiveMessage(
            async (message) => {

                if (message.type !== 'ask') {
                    return;
                }


                try {

                    const answer =
                        await askLexia(
                            message.question,
                            message.code,
                            message.language
                        );


                    // Send AI response to Webview
                    webviewView.webview.postMessage({

                        type: 'response',

                        answer: answer

                    });


                } catch (error) {

                    console.error(
                        'LEXIA API error:',
                        error
                    );


                    webviewView.webview.postMessage({

                        type: 'error',

                        answer:
                            'Sorry, I could not connect to the LEXIA AI service.'

                    });

                }

            }
        );


        // Load Prism.js
        const prismPath =
            path.join(
                this.context.extensionPath,
                'node_modules',
                'prismjs',
                'prism.js'
            );


        const prismScript =
            fs.readFileSync(
                prismPath,
                'utf8'
            );


        // Load Webview UI
        webviewView.webview.html =
            getWebviewHtml(
                prismScript
            );
    }
}