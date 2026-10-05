import * as vscode from 'vscode';

class LexiaViewProvider implements vscode.WebviewViewProvider {

    resolveWebviewView(webviewView: vscode.WebviewView): void {

        webviewView.webview.options = {
            enableScripts: true
        };

        // Receive messages from the Webview
        webviewView.webview.onDidReceiveMessage(async (message) => {

            if (message.type === 'ask') {

                // Send the user's question to the backend
                try {

                    const response = await fetch(
                        'https://lexia-api-v2.onrender.com/ask',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
								userQuestion: message.question,
								code: message.code,
								language: message.language
							})
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Backend returned ${response.status}`
                        );
                    }

                    const data = await response.json() as {
                        answer: string;
                    };

                    // Send the AI response back to the Webview
                    webviewView.webview.postMessage({
                        type: 'response',
                        answer: data.answer
                    });

                } catch (error) {

                    console.error('LEXIA API error:', error);

                    webviewView.webview.postMessage({
                        type: 'error',
                        answer: 'Sorry, I could not connect to the LEXIA AI service.'
                    });
                }
            }
        });

        // Webview HTML
        webviewView.webview.html = `
            <!DOCTYPE html>

            <html>

            <head>

                <style>

                    body {
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-foreground);
                        padding: 10px;
                        margin: 0;
                    }

                    h2 {
                        margin-top: 0;
                        margin-bottom: 16px;
                    }

                    #chat {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .message {
                        padding: 8px;
                        border-radius: 6px;
                    }

                    .message p {
                        margin: 6px 0 0 0;
                        white-space: pre-wrap;
                    }

                    .lexia {
                        background: var(--vscode-textBlockQuote-background);
                    }

                    .user {
                        background: var(--vscode-editor-inactiveSelectionBackground);
                    }

                    .error {
                        background: var(--vscode-inputValidation-errorBackground);
                    }

                    .input-area {
                        margin-top: 20px;
                    }

                    textarea {
                        width: 100%;
                        box-sizing: border-box;
                        resize: vertical;
                        padding: 8px;

                        font-family: var(--vscode-font-family);

                        color: var(--vscode-input-foreground);
                        background: var(--vscode-input-background);

                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                    }

                    textarea:focus {
                        outline: 1px solid var(--vscode-focusBorder);
                    }

                    button {
                        width: 100%;
                        margin-top: 8px;
                        padding: 6px;

                        cursor: pointer;

                        color: var(--vscode-button-foreground);
                        background: var(--vscode-button-background);

                        border: none;
                        border-radius: 4px;
                    }

                    button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }

                    button:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .loading {
                        opacity: 0.7;
                    }

                </style>

            </head>

            <body>

                <h2>✦ LEXIA</h2>

                <div id="chat">

                    <div class="message lexia">

                        <strong>LEXIA</strong>

                        <p>
                            Hi! I'm your AI coding assistant.
                        </p>

                    </div>

                </div>

                <div class="input-area">

                    <textarea
                        id="question"
                        placeholder="Ask LEXIA..."
                        rows="3"
                    ></textarea>

                    <button id="send">
                        Send
                    </button>

                </div>

                <script>

                    const vscode = acquireVsCodeApi();

                    const questionInput =
                        document.getElementById('question');

                    const sendButton =
                        document.getElementById('send');

                    const chat =
                        document.getElementById('chat');


                    // Add a message to the chat
                    function addMessage(sender, text, className) {

                        const message =
                            document.createElement('div');

                        message.className =
                            'message ' + className;

                        const strong =
                            document.createElement('strong');

                        strong.textContent = sender;

                        const paragraph =
                            document.createElement('p');

                        paragraph.textContent = text;

                        message.appendChild(strong);
                        message.appendChild(paragraph);

                        chat.appendChild(message);

                        // Scroll to the newest message
                        message.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }


                    // Send question to VS Code extension
                    function sendQuestion() {

                        const question =
                            questionInput.value.trim();

                        if (!question) {
                            return;
                        }


                        // Show user's message
                        addMessage(
                            'You',
                            question,
                            'user'
                        );


                        // Disable button while waiting
                        sendButton.disabled = true;
                        sendButton.textContent = 'Thinking...';


                        // Send message to extension
                        vscode.postMessage({
                            type: 'ask',
                            question: question
                        });


                        // Clear input
                        questionInput.value = '';
                    }


                    // Send button
                    sendButton.addEventListener(
                        'click',
                        sendQuestion
                    );


                    // Allow Enter to send
                    questionInput.addEventListener(
                        'keydown',
                        (event) => {

                            if (
                                event.key === 'Enter' &&
                                !event.shiftKey
                            ) {

                                event.preventDefault();

                                sendQuestion();
                            }
                        }
                    );


                    // Receive messages from the extension
                    window.addEventListener(
                        'message',
                        event => {

                            const message =
                                event.data;


                            // AI response
                            if (message.type === 'response') {

                                addMessage(
                                    'LEXIA',
                                    message.answer,
                                    'lexia'
                                );

                                sendButton.disabled = false;
                                sendButton.textContent = 'Send';
                            }


                            // Error response
                            if (message.type === 'error') {

                                addMessage(
                                    'LEXIA',
                                    message.answer,
                                    'error'
                                );

                                sendButton.disabled = false;
                                sendButton.textContent = 'Send';
                            }

                        }
                    );

                </script>

            </body>

            </html>
        `;
    }
}


export function activate(context: vscode.ExtensionContext) {

    console.log('LEXIA extension is now active.');

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