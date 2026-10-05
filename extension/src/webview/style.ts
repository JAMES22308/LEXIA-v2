export function getStyles(): string {
    return `
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
            font-size: 13px;
            color: var(--vscode-foreground);
            background: var(--vscode-sideBar-background);
            height: 100vh;
            overflow: hidden;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
            border-bottom: 1px solid var(--vscode-panel-border);
            flex-shrink: 0;
        }

        .logo {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 7px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-weight: 700;
            font-size: 14px;
        }

        .header-text {
            display: flex;
            flex-direction: column;
        }

        .title {
            font-size: 13px;
            font-weight: 600;
        }

        .subtitle {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
        }

        .chat {
            flex: 1;
            overflow-y: auto;
            padding: 18px 14px 100px;
        }

        .welcome {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }

        .welcome-logo {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            margin-bottom: 14px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-size: 22px;
            font-weight: 700;
        }

        .welcome h2 {
            margin: 0 0 8px;
            font-size: 18px;
        }

        .welcome p {
            margin: 0;
            max-width: 300px;
            line-height: 1.5;
            color: var(--vscode-descriptionForeground);
        }

        .message {
            margin-bottom: 20px;
            line-height: 1.55;
        }

        .message-user {
            padding: 9px 11px;
            border-radius: 8px;
            background: var(--vscode-textBlockQuote-background);
            border: 1px solid var(--vscode-textBlockQuote-border);
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .message-lexia {
            padding: 0 2px;
        }

        .message-label {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--vscode-descriptionForeground);
        }

        .markdown {
            word-wrap: break-word;
            overflow-wrap: anywhere;
        }

        .markdown p {
            margin: 0 0 12px;
        }

        .markdown p:last-child {
            margin-bottom: 0;
        }

        .markdown h1,
        .markdown h2,
        .markdown h3,
        .markdown h4 {
            line-height: 1.3;
            margin-top: 18px;
            margin-bottom: 8px;
        }

        .markdown h1 {
            font-size: 20px;
        }

        .markdown h2 {
            font-size: 17px;
        }

        .markdown h3 {
            font-size: 15px;
        }

        .markdown h4 {
            font-size: 14px;
        }

        .markdown ul,
        .markdown ol {
            padding-left: 22px;
            margin-top: 8px;
            margin-bottom: 12px;
        }

        .markdown li {
            margin-bottom: 5px;
        }

        .markdown blockquote {
            margin: 12px 0;
            padding: 8px 12px;
            border-left: 3px solid var(--vscode-textBlockQuote-border);
            background: var(--vscode-textBlockQuote-background);
            color: var(--vscode-descriptionForeground);
        }

        .markdown a {
            color: var(--vscode-textLink-foreground);
        }

        .markdown hr {
            border: 0;
            border-top: 1px solid var(--vscode-panel-border);
            margin: 16px 0;
        }

        .markdown code:not(pre code) {
            padding: 2px 5px;
            border-radius: 4px;
            font-family:
                var(--vscode-editor-font-family),
                Consolas,
                monospace;
            font-size: 0.9em;
            background: var(--vscode-textCodeBlock-background);
        }

        .code-block {
            margin: 12px 0 16px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 7px;
            overflow: hidden;
            background: var(--vscode-textCodeBlock-background);
        }

        .code-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 7px 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
            background: var(--vscode-editor-background);
        }

        .code-language {
            font-size: 10px;
            font-weight: 600;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
        }

        .code-block pre {
            margin: 0;
            padding: 12px 14px;
            overflow-x: auto;
            font-family:
                var(--vscode-editor-font-family),
                Consolas,
                monospace;
            font-size: var(--vscode-editor-font-size);
            line-height: 1.5;
            tab-size: 4;
        }

        .code-block code {
            font-family:
                var(--vscode-editor-font-family),
                Consolas,
                monospace;
            white-space: pre;
        }

        .copy-button {
            border: 0;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            color: var(--vscode-button-secondaryForeground);
            background: var(--vscode-button-secondaryBackground);
        }

        .copy-button:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        .input-area {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 12px;
            background: var(--vscode-sideBar-background);
            border-top: 1px solid var(--vscode-panel-border);
        }

        .input-box {
            display: flex;
            align-items: flex-end;
            gap: 7px;
            padding: 7px;
            border-radius: 8px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
        }

        textarea {
            flex: 1;
            resize: none;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--vscode-input-foreground);
            font-family: inherit;
            font-size: 13px;
            line-height: 1.4;
            max-height: 140px;
        }

        textarea::placeholder {
            color: var(--vscode-input-placeholderForeground);
        }

        button.send {
            border: 0;
            width: 30px;
            height: 30px;
            border-radius: 6px;
            cursor: pointer;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-size: 15px;
        }

        button.send:hover {
            background: var(--vscode-button-hoverBackground);
        }

        button.send:disabled {
            opacity: 0.5;
            cursor: default;
        }

        .loading {
            display: flex;
            gap: 4px;
            padding: 5px 0;
        }

        .loading span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--vscode-descriptionForeground);
            animation: pulse 1.2s infinite;
        }

        .loading span:nth-child(2) {
            animation-delay: 0.15s;
        }

        .loading span:nth-child(3) {
            animation-delay: 0.3s;
        }

        @keyframes pulse {
            0%, 60%, 100% {
                opacity: 0.3;
            }

            30% {
                opacity: 1;
            }
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--vscode-scrollbarSlider-background);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--vscode-scrollbarSlider-hoverBackground);
        }
    `;
}