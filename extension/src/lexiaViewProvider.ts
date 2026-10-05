import * as vscode from 'vscode';

import { askLexia } from './lexiaApi';
import { getWebviewHtml } from './webview';


export class LexiaViewProvider
    implements vscode.WebviewViewProvider {


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


        // Load Webview UI
        webviewView.webview.html =
            getWebviewHtml();
    }
}