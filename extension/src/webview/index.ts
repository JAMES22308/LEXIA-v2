import { getStyles } from "./style";
import { getMarkdownScript } from "./markdown";
import { getChatScript } from "./chat";

export function getWebviewHtml(
    prismScript: string
): string {
    return `
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <style>
        ${getStyles()}
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
                    Ask LEXIA to explain,
                    debug, refactor,
                    or generate code.
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
        ${prismScript}
        ${getMarkdownScript()}
        ${getChatScript()}
    </script>

</body>

</html>
`;
}