import * as vscode from 'vscode';

const LEXIA_API_URL =
    'https://lexia-api-v2.onrender.com/chat';

export function activate(
    context: vscode.ExtensionContext
) {
    console.log('LEXIA is now active.');

    const provider: vscode.WebviewViewProvider = {

        resolveWebviewView(
            webviewView: vscode.WebviewView
        ) {

            const webview =
                webviewView.webview;

            webview.options = {
                enableScripts: true
            };

            webview.html =
                getWebviewHtml();

            webview.onDidReceiveMessage(
                async (message: WebviewMessage) => {

                    if (message.type !== 'ask') {
                        return;
                    }

                    try {

                        
                        const response = await fetch(
                            'https://lexia-api-v2.onrender.com/ask',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    userQuestion: message.question
                                })
                            }
                        );

                        if (!response.ok) {
                            throw new Error(`Backend returned ${response.status}`);
                        }

                        const data = await response.json() as {
                            answer: string;
                            provider?: string;
                        };

                        webviewView.webview.postMessage({
                            type: 'response',
                            answer: data.answer
                        });

                        

                    } catch (error) {

                        console.error(
                            'LEXIA API error:',
                            error
                        );

                        webview.postMessage({
                            type: 'error',
                            answer:
                                'Sorry, I could not connect to LEXIA.'
                        });
                    }
                }
            );
        }
    };

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'lexia.chat',
            provider
        )
    );
}

export function deactivate() {}


/* =========================================
   TYPES
========================================= */

interface WebviewMessage {
    type: string;
    question?: string;
}

interface ApiResponse {
    answer?: string;
    message?: string;
    response?: string;
}


/* =========================================
   WEBVIEW
========================================= */

function getWebviewHtml(): string {

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

html,
body {
    margin: 0;
    padding: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    background: #0d0d12;
    color: #e8e6ed;
}

button,
textarea {
    font-family: inherit;
}


/* =====================================
   APP
===================================== */

.app {
    height: 100vh;
    width: 100%;

    display: flex;
    flex-direction: column;

    background:
        radial-gradient(
            circle at 50% -10%,
            rgba(124, 92, 246, 0.12),
            transparent 42%
        ),
        #0d0d12;
}


/* =====================================
   HEADER
===================================== */

.header {
    height: 52px;
    min-height: 52px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 13px;

    border-bottom:
        1px solid
        rgba(255,255,255,0.07);

    background:
        rgba(16,16,22,0.96);
}

.brand {
    display: flex;
    align-items: center;
    gap: 9px;
}

.logo {
    width: 28px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;

    background:
        linear-gradient(
            135deg,
            #8b5cf6,
            #6366f1
        );

    color: white;

    font-size: 13px;
    font-weight: 800;

    box-shadow:
        0 0 18px
        rgba(124,92,246,0.30);
}

.brand-name {
    font-size: 12px;
    font-weight: 700;

    letter-spacing: 0.6px;
}

.brand-subtitle {
    margin-top: 1px;

    color: #777480;

    font-size: 8px;
}

.status {
    display: flex;
    align-items: center;

    gap: 5px;

    color: #6e6b75;

    font-size: 8px;
}

.status-dot {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #4ade80;

    box-shadow:
        0 0 7px
        rgba(74,222,128,0.7);
}


/* =====================================
   CHAT AREA
===================================== */

.chat {
    flex: 1;

    min-height: 0;

    overflow-y: auto;

    padding: 0 12px 20px;
}

.chat::-webkit-scrollbar {
    width: 5px;
}

.chat::-webkit-scrollbar-thumb {
    background:
        rgba(255,255,255,0.10);

    border-radius: 10px;
}


/* =====================================
   WELCOME
===================================== */

.welcome {
    min-height: 100%;

    display: flex;
    flex-direction: column;

    align-items: center;

    justify-content: center;

    padding:
        35px 8px 30px;

    text-align: center;
}

.welcome.hidden {
    display: none;
}

.hero {
    position: relative;

    width: 62px;
    height: 62px;

    margin-bottom: 18px;
}

.hero-glow {
    position: absolute;

    inset: -20px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(124,92,246,0.25),
            transparent 65%
        );

    filter: blur(10px);
}

.hero-logo {
    position: relative;

    width: 62px;
    height: 62px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 18px;

    background:
        linear-gradient(
            135deg,
            #8b5cf6,
            #6366f1
        );

    color: white;

    font-size: 27px;
    font-weight: 800;

    box-shadow:
        0 12px 35px
        rgba(99,102,241,0.30);
}

.eyebrow {
    margin-bottom: 7px;

    color: #9b82e9;

    font-size: 7px;

    font-weight: 700;

    letter-spacing: 1.5px;
}

.welcome h1 {
    margin: 0;

    max-width: 270px;

    font-size: 22px;

    line-height: 1.25;

    font-weight: 600;

    letter-spacing: -0.5px;

    color: #eeeeF2;
}

.welcome h1 span {
    background:
        linear-gradient(
            90deg,
            #a78bfa,
            #60a5fa
        );

    -webkit-background-clip: text;
    background-clip: text;

    color: transparent;
}

.welcome-description {
    max-width: 270px;

    margin:
        9px 0 23px;

    color: #77747f;

    font-size: 10px;

    line-height: 1.6;
}


/* =====================================
   SUGGESTIONS
===================================== */

.suggestions {
    width: 100%;

    max-width: 300px;

    display: flex;
    flex-direction: column;

    gap: 7px;
}

.suggestion {
    width: 100%;

    min-height: 50px;

    display: flex;
    align-items: center;

    gap: 10px;

    padding:
        8px 10px;

    border:
        1px solid
        rgba(255,255,255,0.07);

    border-radius: 9px;

    background:
        rgba(255,255,255,0.025);

    color: #ddd9e3;

    text-align: left;

    cursor: pointer;

    transition:
        0.15s ease;
}

.suggestion:hover {
    background:
        rgba(139,92,246,0.08);

    border-color:
        rgba(139,92,246,0.35);

    transform:
        translateY(-1px);
}

.suggestion-icon {
    width: 30px;
    height: 30px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 7px;

    font-size: 10px;
    font-weight: 700;
}

.purple {
    background:
        rgba(139,92,246,0.12);

    color: #a78bfa;
}

.blue {
    background:
        rgba(96,165,250,0.11);

    color: #60a5fa;
}

.pink {
    background:
        rgba(244,114,182,0.11);

    color: #f472b6;
}

.suggestion-text {
    flex: 1;

    min-width: 0;

    display: flex;
    flex-direction: column;

    gap: 2px;
}

.suggestion-title {
    font-size: 10px;

    font-weight: 600;

    color: #dedbe4;
}

.suggestion-description {
    font-size: 8px;

    color: #706c77;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}

.arrow {
    color: #504c57;

    font-size: 13px;
}

.suggestion:hover .arrow {
    color: #9b82e9;
}


/* =====================================
   MESSAGES
===================================== */

.messages {
    padding-top: 16px;
}

.message {
    margin-bottom: 15px;
}

.user-message {
    display: flex;

    justify-content: flex-end;
}

.user-bubble {
    max-width: 88%;

    padding:
        8px 11px;

    border-radius:
        10px 10px 3px 10px;

    background:
        linear-gradient(
            135deg,
            #7654d1,
            #595bc8
        );

    color: white;

    font-size: 11px;

    line-height: 1.5;

    box-shadow:
        0 5px 16px
        rgba(80,60,160,0.18);
}

.assistant-message {
    display: flex;

    align-items: flex-start;

    gap: 8px;
}

.assistant-avatar {
    width: 24px;
    height: 24px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 7px;

    background:
        linear-gradient(
            135deg,
            #8b5cf6,
            #6366f1
        );

    color: white;

    font-size: 10px;

    font-weight: 800;
}

.assistant-body {
    min-width: 0;
}

.assistant-name {
    margin-bottom: 5px;

    color: #9b85df;

    font-size: 9px;

    font-weight: 700;
}

.assistant-content {
    color: #c5c1cb;

    font-size: 11px;

    line-height: 1.65;

    overflow-wrap: anywhere;
}

.assistant-content strong {
    color: #efedf2;
}

.assistant-content code {
    padding:
        2px 4px;

    border-radius: 4px;

    background:
        rgba(255,255,255,0.07);

    color: #c4b5fd;

    font-family:
        monospace;

    font-size: 0.9em;
}


/* =====================================
   LOADING
===================================== */

.loading {
    display: flex;

    align-items: flex-start;

    gap: 8px;

    padding:
        5px 0 18px;
}

.loading.hidden {
    display: none;
}

.loading-body {
    padding-top: 1px;
}

.loading-name {
    margin-bottom: 6px;

    color: #9b85df;

    font-size: 9px;

    font-weight: 700;
}

.typing {
    height: 21px;

    display: flex;
    align-items: center;

    gap: 4px;

    padding: 0 9px;

    border:
        1px solid
        rgba(139,92,246,0.12);

    border-radius: 7px;

    background:
        rgba(139,92,246,0.06);
}

.typing span {
    width: 4px;
    height: 4px;

    border-radius: 50%;

    background: #a78bfa;

    animation:
        typing 1.2s infinite;
}

.typing span:nth-child(2) {
    animation-delay: 0.15s;
}

.typing span:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes typing {

    0%,
    60%,
    100% {
        opacity: 0.25;
        transform: translateY(0);
    }

    30% {
        opacity: 1;
        transform: translateY(-3px);
    }
}


/* =====================================
   INPUT
===================================== */

.footer {
    flex-shrink: 0;

    padding:
        7px 9px 8px;

    border-top:
        1px solid
        rgba(255,255,255,0.06);

    background:
        rgba(13,13,18,0.98);
}

.input-container {
    display: flex;

    align-items: flex-end;

    gap: 6px;

    padding:
        5px 5px 5px 10px;

    min-height: 42px;

    border:
        1px solid
        rgba(255,255,255,0.09);

    border-radius: 9px;

    background: #15151c;

    transition:
        border-color 0.15s ease;
}

.input-container:focus-within {
    border-color:
        rgba(139,92,246,0.55);
}

textarea {
    flex: 1;

    min-width: 0;

    max-height: 120px;

    resize: none;

    padding: 5px 0;

    border: none;
    outline: none;

    background: transparent;

    color: #e6e3e9;

    font-size: 11px;

    line-height: 1.5;
}

textarea::placeholder {
    color: #625e69;
}

.send {
    width: 29px;
    height: 29px;

    flex-shrink: 0;

    border: none;

    border-radius: 7px;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        linear-gradient(
            135deg,
            #805ee5,
            #625fd8
        );

    color: white;

    cursor: pointer;

    transition:
        0.15s ease;
}

.send:hover {
    transform: translateY(-1px);

    box-shadow:
        0 4px 14px
        rgba(112,82,199,0.30);
}

.send:disabled {
    opacity: 0.4;

    cursor: default;

    transform: none;
}

.send svg {
    width: 13px;
    height: 13px;

    fill: none;

    stroke: currentColor;

    stroke-width: 1.8;

    stroke-linecap: round;

    stroke-linejoin: round;
}

.footer-note {
    padding-top: 4px;

    text-align: center;

    color: #504c56;

    font-size: 7px;
}


/* =====================================
   NARROW SIDEBAR
===================================== */

@media (max-width: 280px) {

    .status {
        display: none;
    }

    .welcome {
        padding:
            30px 6px;
    }

    .welcome h1 {
        font-size: 19px;
    }

    .suggestion-description {
        display: none;
    }
}

</style>

</head>


<body>

<div class="app">


    <!-- HEADER -->

    <header class="header">

        <div class="brand">

            <div class="logo">
                L
            </div>

            <div>

                <div class="brand-name">
                    LEXIA
                </div>

                <div class="brand-subtitle">
                    AI coding assistant
                </div>

            </div>

        </div>


        <div class="status">

            <span class="status-dot"></span>

            Online

        </div>

    </header>


    <!-- CHAT -->

    <main
        id="chat"
        class="chat"
    >

        <section
            id="welcome"
            class="welcome"
        >

            <div class="hero">

                <div class="hero-glow"></div>

                <div class="hero-logo">
                    L
                </div>

            </div>


            <div class="eyebrow">
                AI CODING ASSISTANT
            </div>


            <h1>
                What are you
                <span>building?</span>
            </h1>


            <p class="welcome-description">
                Ask LEXIA to explain code, debug errors,
                or help you build something new.
            </p>


            <div class="suggestions">


                <button
                    class="suggestion"
                    data-question="Explain this code to me"
                >

                    <div class="suggestion-icon purple">
                        &lt;/&gt;
                    </div>

                    <div class="suggestion-text">

                        <div class="suggestion-title">
                            Explain code
                        </div>

                        <div class="suggestion-description">
                            Understand how your code works
                        </div>

                    </div>

                    <span class="arrow">
                        →
                    </span>

                </button>


                <button
                    class="suggestion"
                    data-question="Help me debug this code"
                >

                    <div class="suggestion-icon blue">
                        ⚡
                    </div>

                    <div class="suggestion-text">

                        <div class="suggestion-title">
                            Debug an error
                        </div>

                        <div class="suggestion-description">
                            Find and fix the problem
                        </div>

                    </div>

                    <span class="arrow">
                        →
                    </span>

                </button>


                <button
                    class="suggestion"
                    data-question="How can I improve this code?"
                >

                    <div class="suggestion-icon pink">
                        ✦
                    </div>

                    <div class="suggestion-text">

                        <div class="suggestion-title">
                            Improve code
                        </div>

                        <div class="suggestion-description">
                            Make your code cleaner
                        </div>

                    </div>

                    <span class="arrow">
                        →
                    </span>

                </button>


            </div>

        </section>


        <div
            id="messages"
            class="messages"
        ></div>


        <div
            id="loading"
            class="loading hidden"
        >

            <div class="assistant-avatar">
                L
            </div>

            <div class="loading-body">

                <div class="loading-name">
                    LEXIA
                </div>

                <div class="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>

    </main>


    <!-- INPUT -->

    <footer class="footer">

        <div class="input-container">

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

                <svg viewBox="0 0 24 24">

                    <path d="M22 2L11 13"></path>

                    <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                    ></path>

                </svg>

            </button>

        </div>


        <div class="footer-note">
            Enter to send · Shift + Enter for new line
        </div>

    </footer>

</div>


<script>

const vscode =
    acquireVsCodeApi();


const input =
    document.getElementById('input');

const send =
    document.getElementById('send');

const chat =
    document.getElementById('chat');

const welcome =
    document.getElementById('welcome');

const messages =
    document.getElementById('messages');

const loading =
    document.getElementById('loading');


let isLoading = false;


/* =====================================
   SEND MESSAGE
===================================== */

function sendMessage() {

    const question =
        input.value.trim();

    if (!question || isLoading) {
        return;
    }

    isLoading = true;

    send.disabled = true;

    welcome.classList.add('hidden');

    addUserMessage(question);

    input.value = '';

    input.style.height =
        'auto';

    loading.classList.remove('hidden');

    scrollBottom();

    vscode.postMessage({

        type: 'ask',

        question: question

    });
}


/* =====================================
   USER MESSAGE
===================================== */

function addUserMessage(text) {

    const message =
        document.createElement('div');

    message.className =
        'message user-message';

    message.innerHTML = \`
        <div class="user-bubble">
            \${escapeHtml(text)}
        </div>
    \`;

    messages.appendChild(message);
}


/* =====================================
   LEXIA MESSAGE
===================================== */

function addLexiaMessage(text) {

    const message =
        document.createElement('div');

    message.className =
        'message assistant-message';

    message.innerHTML = \`
        <div class="assistant-avatar">
            L
        </div>

        <div class="assistant-body">

            <div class="assistant-name">
                LEXIA
            </div>

            <div class="assistant-content">
                \${formatText(text)}
            </div>

        </div>
    \`;

    messages.appendChild(message);

    scrollBottom();
}




/* =====================================
   TEXT FORMAT
===================================== */


function formatText(text) {

    let result =
        escapeHtml(text);

    result =
        result.replace(
            /\\*\\*(.*?)\\*\\*/g,
            '<strong>$1</strong>'
        );

    result =
        result.replace(
            /\`(.*?)\`/g,
            '<code>$1</code>'
        );

    result =
        result.replace(
            /\\n/g,
            '<br>'
        );

    return result;
}





/* =====================================
   ESCAPE HTML
===================================== */

function escapeHtml(text) {

    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* =====================================
   API RESPONSE
===================================== */

window.addEventListener(
    'message',
    function(event) {

        const message =
            event.data;

        if (
            message.type === 'response' ||
            message.type === 'error'
        ) {

            isLoading = false;

            send.disabled = false;

            loading.classList.add(
                'hidden'
            );

            addLexiaMessage(
                message.answer
            );
        }
    }
);


/* =====================================
   SEND BUTTON
===================================== */

send.addEventListener(
    'click',
    sendMessage
);


/* =====================================
   KEYBOARD
===================================== */

input.addEventListener(
    'keydown',
    function(event) {

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);


/* =====================================
   TEXTAREA RESIZE
===================================== */

input.addEventListener(
    'input',
    function() {

        input.style.height =
            'auto';

        input.style.height =
            Math.min(
                input.scrollHeight,
                120
            ) + 'px';
    }
);


/* =====================================
   SUGGESTIONS
===================================== */

document
    .querySelectorAll('.suggestion')
    .forEach(
        function(button) {

            button.addEventListener(
                'click',
                function() {

                    input.value =
                        button.dataset.question || '';

                    input.focus();

                    input.dispatchEvent(
                        new Event('input')
                    );
                }
            );
        }
    );


/* =====================================
   SCROLL
===================================== */

function scrollBottom() {

    setTimeout(
        function() {

            chat.scrollTop =
                chat.scrollHeight;

        },
        30
    );
}

</script>

</body>

</html>

`;
}