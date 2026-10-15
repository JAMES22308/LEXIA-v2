const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://lexia-api-v2.onrender.com/ask';

function activate(context) {
    const provider = new LexiaViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'lexia-reader.chat',
            provider
        )
    );
}

class LexiaViewProvider {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
        this.webviewView = undefined;
        this.busy = false;
    }

    resolveWebviewView(webviewView) {
        this.webviewView = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.extensionUri, 'media')
            ]
        };

        webviewView.webview.html = this.getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'ask') {
                await this.askAboutCurrentFile(message.question);
            }
        });
    }

    getHtml(webview) {
        const media = vscode.Uri.joinPath(this.extensionUri, 'media');
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(media, 'styles.css')
        );
        const jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(media, 'chat.js')
        );

        const nonce = [...Array(32)]
            .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)])
            .join('');

        const htmlPath = path.join(this.extensionUri.fsPath, 'media', 'index.html');

        return fs.readFileSync(htmlPath, 'utf8')
            .replaceAll('{{CSP}}', webview.cspSource)
            .replaceAll('{{NONCE}}', nonce)
            .replaceAll('{{CSS_URI}}', cssUri.toString())
            .replaceAll('{{JS_URI}}', jsUri.toString());
    }

    async askAboutCurrentFile(question) {
        if (this.busy) return;

        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            this.send({
                command: 'error',
                text: 'Open a code file in the editor before asking LEXIA.'
            });
            return;
        }

        const fileName = path.basename(editor.document.fileName);
        const fileContent = editor.document.getText();

        if (!fileContent.trim()) {
            this.send({
                command: 'error',
                text: 'The active file is empty.'
            });
            return;
        }

        this.busy = true;
        this.send({ command: 'loading' });

        try {
            const userQuestion =
                `You are LEXIA, a helpful coding assistant.\n` +
                `Answer the user's question about the supplied file.\n` +
                `Use clear headings, concise explanations, bullet points, and ` +
                `fenced code blocks when appropriate. Explain improvements and bugs.\n` +
                `Avoid Markdown tables. Present issues and comparisons using numbered ` +
                `or bulleted lists with clear labels and short explanations.\n` +
                `Keep formatting clean and readable in a narrow VS Code sidebar.\n` +
                `Do not output escaped table syntax such as \\| or unnecessary formatting labels such as javascriptCopy.\n\n` +
                `User question: ${question}\n\n` +
                `File name: ${fileName}\n\n` +
                `File contents:\n${fileContent}`;


            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuestion })
            });

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            const data = await response.json();

            this.send({
                command: 'answer',
                question,
                answer: data.answer || 'LEXIA returned an empty response.',
                provider: data.provider || 'LEXIA'
            });
        } catch (error) {
            this.send({
                command: 'error',
                text: `Unable to get a response: ${error.message}`
            });
        } finally {
            this.busy = false;
        }
    }

    send(message) {
        this.webviewView?.webview.postMessage(message);
    }
}

function deactivate() {}

module.exports = { activate, deactivate };