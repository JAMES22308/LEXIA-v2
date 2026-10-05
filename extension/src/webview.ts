
export function getWebviewHtml(): string {
    return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <style>

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

            background:
                var(--vscode-sideBar-background);

            height: 100vh;

            overflow: hidden;
        }


        /* -------------------------
           Main container
        ------------------------- */

        .container {
            display: flex;
            flex-direction: column;

            height: 100vh;
        }


        /* -------------------------
           Header
        ------------------------- */

        .header {
            display: flex;
            align-items: center;

            gap: 10px;

            padding: 12px 14px;

            border-bottom:
                1px solid
                var(--vscode-panel-border);

            flex-shrink: 0;
        }

        .logo {
            width: 28px;
            height: 28px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 7px;

            background:
                var(--vscode-button-background);

            color:
                var(--vscode-button-foreground);

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

            color:
                var(--vscode-descriptionForeground);
        }


        /* -------------------------
           Chat
        ------------------------- */

        .chat {
            flex: 1;

            overflow-y: auto;

            padding: 18px 14px 100px;
        }


        /* -------------------------
           Welcome
        ------------------------- */

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

            background:
                var(--vscode-button-background);

            color:
                var(--vscode-button-foreground);

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

            color:
                var(--vscode-descriptionForeground);
        }


        /* -------------------------
           Messages
        ------------------------- */

        .message {
            margin-bottom: 20px;

            line-height: 1.55;
        }

        .message-user {
            padding: 9px 11px;

            border-radius: 8px;

            background:
                var(--vscode-textBlockQuote-background);

            border:
                1px solid
                var(--vscode-textBlockQuote-border);
        }

        .message-lexia {
            padding: 0 2px;
        }

        .message-label {
            font-size: 11px;

            font-weight: 600;

            margin-bottom: 6px;

            color:
                var(--vscode-descriptionForeground);
        }


        /* -------------------------
           Markdown
        ------------------------- */

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
            margin-top: 18px;
            margin-bottom: 8px;

            line-height: 1.3;
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

            border-left:
                3px solid
                var(--vscode-textBlockQuote-border);

            background:
                var(--vscode-textBlockQuote-background);

            color:
                var(--vscode-descriptionForeground);
        }

        .markdown a {
            color:
                var(--vscode-textLink-foreground);
        }

        .markdown hr {
            border: 0;

            border-top:
                1px solid
                var(--vscode-panel-border);

            margin: 16px 0;
        }

        .markdown code:not(pre code) {
            padding: 2px 5px;

            border-radius: 4px;

            font-family:
                var(--vscode-editor-font-family),
                monospace;

            font-size: 0.9em;

            background:
                var(--vscode-textCodeBlock-background);
        }


        /* -------------------------
           Code blocks
        ------------------------- */

        .code-wrapper {
            position: relative;

            margin: 12px 0 16px;
        }

        .code-wrapper pre {
            margin: 0;

            padding: 14px;

            padding-top: 38px;

            overflow-x: auto;

            border-radius: 7px;

            background:
                var(--vscode-textCodeBlock-background);

            border:
                1px solid
                var(--vscode-panel-border);

            font-family:
                var(--vscode-editor-font-family),
                Consolas,
                monospace;

            font-size:
                var(--vscode-editor-font-size);

            line-height: 1.5;
        }

        .code-wrapper code {
            font-family:
                var(--vscode-editor-font-family),
                Consolas,
                monospace;
        }

        .code-language {
            position: absolute;

            top: 8px;
            left: 12px;

            font-size: 10px;

            color:
                var(--vscode-descriptionForeground);

            text-transform: uppercase;
        }

        .copy-button {
            position: absolute;

            top: 6px;
            right: 7px;

            border: 0;

            border-radius: 4px;

            padding: 4px 7px;

            cursor: pointer;

            color:
                var(--vscode-button-secondaryForeground);

            background:
                var(--vscode-button-secondaryBackground);
        }

        .copy-button:hover {
            background:
                var(--vscode-button-secondaryHoverBackground);
        }


        /* -------------------------
           Input
        ------------------------- */

        .input-area {
            position: fixed;

            bottom: 0;
            left: 0;
            right: 0;

            padding: 10px 12px;

            background:
                var(--vscode-sideBar-background);

            border-top:
                1px solid
                var(--vscode-panel-border);
        }

        .input-box {
            display: flex;

            align-items: flex-end;

            gap: 7px;

            padding: 7px;

            border-radius: 8px;

            background:
                var(--vscode-input-background);

            border:
                1px solid
                var(--vscode-input-border);
        }

        textarea {
            flex: 1;

            resize: none;

            border: 0;

            outline: 0;

            background: transparent;

            color:
                var(--vscode-input-foreground);

            font-family: inherit;

            font-size: 13px;

            line-height: 1.4;

            max-height: 140px;
        }

        textarea::placeholder {
            color:
                var(--vscode-input-placeholderForeground);
        }

        button.send {
            border: 0;

            width: 30px;
            height: 30px;

            border-radius: 6px;

            cursor: pointer;

            background:
                var(--vscode-button-background);

            color:
                var(--vscode-button-foreground);

            font-size: 15px;
        }

        button.send:hover {
            background:
                var(--vscode-button-hoverBackground);
        }

        button.send:disabled {
            opacity: 0.5;

            cursor: default;
        }


        /* -------------------------
           Loading
        ------------------------- */

        .loading {
            display: flex;

            gap: 4px;

            padding: 5px 0;
        }

        .loading span {
            width: 5px;
            height: 5px;

            border-radius: 50%;

            background:
                var(--vscode-descriptionForeground);

            animation:
                pulse 1.2s infinite;
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


        /* -------------------------
           Scrollbar
        ------------------------- */

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background:
                var(--vscode-scrollbarSlider-background);
        }

        ::-webkit-scrollbar-thumb:hover {
            background:
                var(--vscode-scrollbarSlider-hoverBackground);
        }

    </style>
</head>


<body>

<div class="container">

    <div class="header">

        <div class="logo">
            L
        </div>

        <div class="header-text">

            <div class="title">
                LEXIA
            </div>

            <div class="subtitle">
                AI coding assistant
            </div>

        </div>

    </div>


    <div
        id="chat"
        class="chat"
    >

        <div
            id="welcome"
            class="welcome"
        >

            <div class="welcome-logo">
                L
            </div>

            <h2>
                How can I help?
            </h2>

            <p>
                Ask LEXIA to explain, debug,
                refactor, or generate code.
            </p>

        </div>

    </div>


    <div class="input-area">

        <div class="input-box">

            <textarea
                id="input"
                rows="1"
                placeholder="Ask LEXIA anything..."
            ></textarea>

            <button
                id="send"
                class="send"
                title="Send"
            >
                ↑
            </button>

        </div>

    </div>

</div>


<script>

    const vscode =
        acquireVsCodeApi();

    const chat =
        document.getElementById("chat");

    const input =
        document.getElementById("input");

    const send =
        document.getElementById("send");

    const welcome =
        document.getElementById("welcome");


    /* -------------------------
       Escape HTML
    ------------------------- */

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    /* -------------------------
       Markdown renderer
    ------------------------- */

    function renderMarkdown(markdown) {

        // The Markdown is already rendered
        // by marked on the extension side.

        return markdown;
    }


    /* -------------------------
       Add user message
    ------------------------- */

    function addUserMessage(text) {

        welcome.style.display = "none";

        const message =
            document.createElement("div");

        message.className =
            "message message-user";

        message.textContent =
            text;

        chat.appendChild(message);

        scrollToBottom();
    }


    /* -------------------------
       Add LEXIA message
    ------------------------- */

    function addLexiaMessage(html) {

        const message =
            document.createElement("div");

        message.className =
            "message message-lexia";

        message.innerHTML =

            '<div class="message-label">' +
            'LEXIA' +
            '</div>' +

            '<div class="markdown">' +
            renderMarkdown(html) +
            '</div>';

        chat.appendChild(message);

        addCodeButtons(message);

        scrollToBottom();
    }


    /* -------------------------
       Loading indicator
    ------------------------- */

    function addLoading() {

        const loading =
            document.createElement("div");

        loading.id =
            "loading";

        loading.className =
            "message message-lexia";

        loading.innerHTML =

            '<div class="message-label">' +
            'LEXIA' +
            '</div>' +

            '<div class="loading">' +
                '<span></span>' +
                '<span></span>' +
                '<span></span>' +
            '</div>';

        chat.appendChild(loading);

        scrollToBottom();
    }


    function removeLoading() {

        const loading =
            document.getElementById("loading");

        if (loading) {
            loading.remove();
        }
    }


    /* -------------------------
       Code copy buttons
    ------------------------- */

    function addCodeButtons(message) {

        const blocks =
            message.querySelectorAll("pre");

        blocks.forEach(pre => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "code-wrapper";

            pre.parentNode.insertBefore(
                wrapper,
                pre
            );

            wrapper.appendChild(pre);


            const code =
                pre.querySelector("code");


            let language = "";


            if (code) {

                const match =
                    code.className.match(
                        /language-(\\w+)/
                    );

                if (match) {
                    language = match[1];
                }
            }


            const label =
                document.createElement("span");

            label.className =
                "code-language";

            label.textContent =
                language || "code";

            wrapper.appendChild(label);


            const button =
                document.createElement("button");

            button.className =
                "copy-button";

            button.textContent =
                "Copy";


            button.addEventListener(
                "click",
                async () => {

                    if (!code) {
                        return;
                    }

                    await navigator.clipboard.writeText(
                        code.textContent || ""
                    );

                    button.textContent =
                        "Copied!";

                    setTimeout(() => {

                        button.textContent =
                            "Copy";

                    }, 1500);

                }
            );


            wrapper.appendChild(button);

        });
    }


    /* -------------------------
       Send message
    ------------------------- */

    function sendMessage() {

        const question =
            input.value.trim();

        if (!question) {
            return;
        }


        addUserMessage(question);

        input.value = "";

        resizeInput();

        send.disabled = true;

        addLoading();


        vscode.postMessage({

            type: "ask",

            question: question

        });

    }


    send.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* -------------------------
       Auto resize textarea
    ------------------------- */

    function resizeInput() {

        input.style.height =
            "auto";

        input.style.height =
            Math.min(
                input.scrollHeight,
                140
            ) + "px";
    }


    input.addEventListener(
        "input",
        resizeInput
    );


    /* -------------------------
       Receive backend response
    ------------------------- */

    window.addEventListener(
        "message",
        event => {

            const message =
                event.data;


            if (message.type === "response") {

                removeLoading();

                addLexiaMessage(
                    message.answer
                );

                send.disabled =
                    false;

            }


            if (message.type === "error") {

                removeLoading();

                addLexiaMessage(
                    "<p>" +
                    escapeHtml(
                        message.answer
                    ) +
                    "</p>"
                );

                send.disabled =
                    false;

            }

        }
    );


    /* -------------------------
       Scroll
    ------------------------- */

    function scrollToBottom() {

        chat.scrollTop =
            chat.scrollHeight;

    }

</script>

</body>
</html>
`;
}

