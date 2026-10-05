export function getChatScript(): string {
    return `
        const vscode = acquireVsCodeApi();

        const chat = document.getElementById("chat");
        const input = document.getElementById("input");
        const send = document.getElementById("send");
        const welcome = document.getElementById("welcome");

        function addUserMessage(text) {
            welcome.style.display = "none";

            const message = document.createElement("div");

            message.className =
                "message message-user";

            message.textContent = text;

            chat.appendChild(message);

            scrollToBottom();
        }

        function addLexiaMessage(markdown) {
            const message = document.createElement("div");

            message.className =
                "message message-lexia";

            message.innerHTML =
                '<div class="message-label">LEXIA</div>' +
                '<div class="markdown">' +
                    renderMarkdown(markdown) +
                '</div>';

            chat.appendChild(message);

            addCodeButtons(message);

            scrollToBottom();
        }

        function addLoading() {
            const loading = document.createElement("div");

            loading.id = "loading";
            loading.className =
                "message message-lexia";

            loading.innerHTML =
                '<div class="message-label">LEXIA</div>' +
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

        function addCodeButtons(message) {
            const buttons =
                message.querySelectorAll(".copy-button");

            buttons.forEach(function(button) {
                button.addEventListener(
                    "click",
                    async function() {

                        const block =
                            button.closest(".code-block");

                        if (!block) {
                            return;
                        }

                        const code =
                            block.querySelector("code");

                        if (!code) {
                            return;
                        }

                        try {
                            await navigator.clipboard.writeText(
                                code.textContent || ""
                            );

                            button.textContent = "Copied!";

                            setTimeout(
                                function() {
                                    button.textContent = "Copy";
                                },
                                1500
                            );

                        } catch (error) {
                            button.textContent = "Failed";

                            setTimeout(
                                function() {
                                    button.textContent = "Copy";
                                },
                                1500
                            );
                        }
                    }
                );
            });
        }

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
            function(event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {
                    event.preventDefault();

                    sendMessage();
                }
            }
        );

        function resizeInput() {
            input.style.height = "auto";

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

        window.addEventListener(
            "message",
            function(event) {

                const message = event.data;

                if (message.type === "response") {

                    removeLoading();

                    addLexiaMessage(
                        message.answer
                    );

                    send.disabled = false;
                }

                if (message.type === "error") {

                    removeLoading();

                    addLexiaMessage(
                        message.answer
                    );

                    send.disabled = false;
                }
            }
        );

        function scrollToBottom() {
            chat.scrollTop =
                chat.scrollHeight;
        }
    `;
}