const vscode = acquireVsCodeApi();

const questionInput = document.getElementById('question');
const sendButton = document.getElementById('send');
const conversation = document.getElementById('conversation');
const welcome = document.getElementById('welcome');
const errorBox = document.getElementById('error');

let busy = false;
let lastAnswer = '';

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function inlineMarkdown(value) {
    let text = escapeHtml(value);

    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

    return text;
}

function renderMarkdown(markdown) {
    const codeBlocks = [];

let text = String(markdown).replace(
    /```([\w.+#-]*)[ \t]*\n([\s\S]*?)```/g,
    (_, language, code) => {
        const index = codeBlocks.length;

        // Clean up accidental labels such as javascriptCopy.
        language = (language || 'text').replace(/Copy$/i, '');

        codeBlocks.push({
            language,
            code: code.replace(/\n$/, '')
        });

        return `\n@@CODEBLOCK${index}@@\n`;
    }
);

    text = escapeHtml(text);

    const lines = text.split('\n');
    const output = [];
    let inList = false;
    let listType = '';
    let paragraph = [];

    function closeParagraph() {
        if (paragraph.length) {
            output.push(`<p>${paragraph.join('<br>')}</p>`);
            paragraph = [];
        }
    }

    function closeList() {
        if (inList) {
            output.push(`</${listType}>`);
            inList = false;
            listType = '';
        }
    }

    for (const line of lines) {
        const trimmed = line.trim();

        const codeMatch = trimmed.match(/^@@CODEBLOCK(\d+)@@$/);
        if (codeMatch) {
            closeParagraph();
            closeList();

            const block = codeBlocks[Number(codeMatch[1])];

let highlightedCode = escapeHtml(block.code);

if (window.hljs) {
    const language = block.language.toLowerCase();

    if (window.hljs.getLanguage(language)) {
        highlightedCode = window.hljs.highlight(block.code, {
            language
        }).value;
    } else {
        highlightedCode = window.hljs.highlightAuto(block.code).value;
    }
}

output.push(`
    <div class="code-card">
        <div class="code-header">
            <span>${escapeHtml(block.language)}</span>
            <button class="copy-button"
                data-copy-code="${Number(codeMatch[1])}">
                Copy
            </button>
        </div>
        <pre><code class="hljs language-${escapeHtml(block.language)}">${highlightedCode}</code></pre>
    </div>
`);
            continue;
        }

        if (!trimmed) {
            closeParagraph();
            closeList();
            continue;
        }

        if (/^---+$/.test(trimmed)) {
            closeParagraph();
            closeList();
            output.push('<hr>');
            continue;
        }

        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
            closeParagraph();
            closeList();
            const level = heading[1].length;
            output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
            continue;
        }

        const unordered = trimmed.match(/^[-*]\s+(.+)$/);
        const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);

        if (unordered || ordered) {
            closeParagraph();

            const nextType = unordered ? 'ul' : 'ol';
            if (inList && listType !== nextType) closeList();

            if (!inList) {
                listType = nextType;
                output.push(`<${listType}>`);
                inList = true;
            }

            output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
            continue;
        }

        closeList();

        if (trimmed.startsWith('&gt; ')) {
            closeParagraph();
            output.push(`<blockquote>${inlineMarkdown(trimmed.slice(5))}</blockquote>`);
            continue;
        }

        paragraph.push(inlineMarkdown(trimmed));
    }

    closeParagraph();
    closeList();

    return {
        html: output.join('\n'),
        codeBlocks
    };
}

function addUserMessage(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message';

    const bubble = document.createElement('div');
    bubble.className = 'user-message';
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    conversation.appendChild(wrapper);
}

function addAssistantMessage(answer, provider = 'LEXIA') {
    const wrapper = document.createElement('div');
    wrapper.className = 'message assistant-message';

    const label = document.createElement('div');
    label.className = 'assistant-label';

    const mark = document.createElement('span');
    mark.className = 'assistant-mark';
    mark.textContent = 'L';

    const name = document.createElement('span');
    name.textContent = provider === 'LEXIA' ? 'LEXIA' : `LEXIA · ${provider}`;

    label.append(mark, name);

    const content = document.createElement('div');
    content.className = 'assistant-content';

  
    const cleanedAnswer = answer
        .replace(/\\\|/g, '|')
        .replace(/\\\s*\n/g, '\n')
        .trim();

    const rendered = renderMarkdown(cleanedAnswer);

    content.innerHTML = rendered.html;

    const actions = document.createElement('div');
    actions.className = 'message-actions';

    const copyAnswer = document.createElement('button');
    copyAnswer.className = 'action-button';
    copyAnswer.textContent = '▢ Copy response';
    copyAnswer.addEventListener('click', () => {
        copyText(answer, copyAnswer);
    });

    actions.appendChild(copyAnswer);
    wrapper.append(label, content, actions);
    conversation.appendChild(wrapper);

    content.querySelectorAll('[data-copy-code]').forEach(button => {
        button.addEventListener('click', () => {
            const block = rendered.codeBlocks[Number(button.dataset.copyCode)];
            if (block) copyText(block.code, button);
        });
    });

    conversation.scrollTop = conversation.scrollHeight;
    wrapper.scrollIntoView({ block: 'nearest' });
}

async function copyText(text, button) {
    const original = button.textContent;

    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const temporary = document.createElement('textarea');
        temporary.value = text;
        temporary.style.position = 'fixed';
        temporary.style.opacity = '0';
        document.body.appendChild(temporary);
        temporary.select();

        const copied = document.execCommand('copy');
        temporary.remove();

        if (!copied) {
            button.textContent = 'Copy failed';
            setTimeout(() => button.textContent = original, 1500);
            return;
        }
    }

    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = original, 1500);
}

function ask() {
    if (busy) return;

    const question = questionInput.value.trim();
    if (!question) return;

    busy = true;
    sendButton.disabled = true;
    errorBox.hidden = true;
    welcome.hidden = true;

    addUserMessage(question);

    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'LEXIA is thinking…';
    loading.id = 'lexia-loading';
    conversation.appendChild(loading);

    questionInput.value = '';
    vscode.postMessage({ command: 'ask', question });
}

sendButton.addEventListener('click', ask);

questionInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        ask();
    }
});

document.querySelectorAll('.suggestion').forEach(button => {
    button.addEventListener('click', () => {
        questionInput.value = button.dataset.question;
        ask();
    });
});

window.addEventListener('message', event => {
    const message = event.data;
    const loading = document.getElementById('lexia-loading');

    if (loading) loading.remove();

    if (message.command === 'loading') {
        welcome.hidden = true;
        return;
    }

    if (message.command === 'answer') {
        lastAnswer = message.answer;
        addAssistantMessage(message.answer, message.provider);
        errorBox.hidden = true;
        busy = false;
        sendButton.disabled = false;
        questionInput.focus();
        return;
    }

    if (message.command === 'error') {
        errorBox.textContent = message.text;
        errorBox.hidden = false;
        busy = false;
        sendButton.disabled = false;
    }
});