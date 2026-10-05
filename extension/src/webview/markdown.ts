// export function getMarkdownScript(): string {
//     return `
//         function escapeHtml(text) {
//             const div = document.createElement("div");
//             div.textContent = text;
//             return div.innerHTML;
//         }

//         function renderMarkdown(markdown) {
//             let html = escapeHtml(markdown);

//             const fence = String.fromCharCode(96, 96, 96);

//             // Code blocks
//             const codePattern = new RegExp(
//                 fence +
//                 "([a-zA-Z0-9_+#.-]*)[\\\\t ]*\\\\n" +
//                 "([\\\\s\\\\S]*?)" +
//                 fence,
//                 "g"
//             );

//             html = html.replace(
//                 codePattern,
//                 function(match, language, code) {
//                     const lang = language || "code";

//                     return (
//                         '<div class="code-block">' +
//                             '<div class="code-header">' +
//                                 '<span class="code-language">' +
//                                     escapeHtml(lang) +
//                                 '</span>' +
//                                 '<button class="copy-button">' +
//                                     'Copy' +
//                                 '</button>' +
//                             '</div>' +
//                             '<pre><code>' +
//                                 code +
//                             '</code></pre>' +
//                         '</div>'
//                     );
//                 }
//             );

//             // Headings
//             html = html.replace(
//                 /^#### (.*)$/gm,
//                 "<h4>$1</h4>"
//             );

//             html = html.replace(
//                 /^### (.*)$/gm,
//                 "<h3>$1</h3>"
//             );

//             html = html.replace(
//                 /^## (.*)$/gm,
//                 "<h2>$1</h2>"
//             );

//             html = html.replace(
//                 /^# (.*)$/gm,
//                 "<h1>$1</h1>"
//             );

//             // Bold
//             html = html.replace(
//                 /\\*\\*(.*?)\\*\\*/g,
//                 "<strong>$1</strong>"
//             );

//             // Italic
//             html = html.replace(
//                 /(?<!\\*)\\*([^*\\n]+)\\*(?!\\*)/g,
//                 "<em>$1</em>"
//             );

//             // Inline code
//             const tick = String.fromCharCode(96);

//             const inlineCodePattern = new RegExp(
//                 tick +
//                 "([^" +
//                 tick +
//                 "\\\\n]+)" +
//                 tick,
//                 "g"
//             );

//             html = html.replace(
//                 inlineCodePattern,
//                 "<code>$1</code>"
//             );

//             // Unordered lists
//             html = html.replace(
//                 /^(?:- .*(?:\\n|$))+/gm,
//                 function(block) {
//                     const items = block
//                         .trim()
//                         .split("\\n")
//                         .map(function(item) {
//                             return (
//                                 "<li>" +
//                                 item.substring(2) +
//                                 "</li>"
//                             );
//                         })
//                         .join("");

//                     return "<ul>" + items + "</ul>";
//                 }
//             );

//             // Ordered lists
//             html = html.replace(
//                 /^(?:\\d+\\. .*(?:\\n|$))+/gm,
//                 function(block) {
//                     const items = block
//                         .trim()
//                         .split("\\n")
//                         .map(function(item) {
//                             return (
//                                 "<li>" +
//                                 item.replace(
//                                     /^\\d+\\. /,
//                                     ""
//                                 ) +
//                                 "</li>"
//                             );
//                         })
//                         .join("");

//                     return "<ol>" + items + "</ol>";
//                 }
//             );

//             // Blockquotes
//             html = html.replace(
//                 /^> (.*)$/gm,
//                 "<blockquote>$1</blockquote>"
//             );

//             // Horizontal rule
//             html = html.replace(
//                 /^---$/gm,
//                 "<hr>"
//             );

//             // Paragraphs
//             html = html
//                 .split(/\\n\\n+/)
//                 .map(function(block) {
//                     block = block.trim();

//                     if (!block) {
//                         return "";
//                     }

//                     if (
//                         block.startsWith("<h1>") ||
//                         block.startsWith("<h2>") ||
//                         block.startsWith("<h3>") ||
//                         block.startsWith("<h4>") ||
//                         block.startsWith("<ul>") ||
//                         block.startsWith("<ol>") ||
//                         block.startsWith("<blockquote>") ||
//                         block.startsWith("<hr>") ||
//                         block.startsWith(
//                             '<div class="code-block">'
//                         )
//                     ) {
//                         return block;
//                     }

//                     return (
//                         "<p>" +
//                         block.replace(
//                             /\\n/g,
//                             "<br>"
//                         ) +
//                         "</p>"
//                     );
//                 })
//                 .join("");

//             return html;
//         }
//     `;
// }

























export function getMarkdownScript(): string {
    return `
        function escapeHtml(text) {
            const div = document.createElement("div");
            div.textContent = text;
            return div.innerHTML;
        }

        function renderMarkdown(markdown) {
            let html = escapeHtml(markdown);

            const fence = String.fromCharCode(96, 96, 96);

            // Code blocks
            const codePattern = new RegExp(
                fence +
                "([a-zA-Z0-9_+#.-]*)[\\\\t ]*\\\\n" +
                "([\\\\s\\\\S]*?)" +
                fence,
                "g"
            );

            html = html.replace(
                codePattern,
                function(match, language, code) {
                    const lang = language || "text";

                    const escapedCode =
                        escapeHtml(code);

                    return (
                        '<div class="code-block">' +
                            '<div class="code-header">' +
                                '<span class="code-language">' +
                                    escapeHtml(lang) +
                                '</span>' +
                                '<button class="copy-button">' +
                                    'Copy' +
                                '</button>' +
                            '</div>' +
                            '<pre><code class="language-' +
                                escapeHtml(lang) +
                            '">' +
                                escapedCode +
                            '</code></pre>' +
                        '</div>'
                    );
                }
            );

            // Headings
            html = html.replace(
                /^#### (.*)$/gm,
                "<h4>$1</h4>"
            );

            html = html.replace(
                /^### (.*)$/gm,
                "<h3>$1</h3>"
            );

            html = html.replace(
                /^## (.*)$/gm,
                "<h2>$1</h2>"
            );

            html = html.replace(
                /^# (.*)$/gm,
                "<h1>$1</h1>"
            );

            // Bold
            html = html.replace(
                /\\*\\*(.*?)\\*\\*/g,
                "<strong>$1</strong>"
            );

            // Italic
            html = html.replace(
                /(?<!\\*)\\*([^*\\n]+)\\*(?!\\*)/g,
                "<em>$1</em>"
            );

            // Inline code
            const tick = String.fromCharCode(96);

            const inlineCodePattern = new RegExp(
                tick +
                "([^" +
                tick +
                "\\\\n]+)" +
                tick,
                "g"
            );

            html = html.replace(
                inlineCodePattern,
                "<code>$1</code>"
            );

            // Unordered lists
            html = html.replace(
                /^(?:- .*(?:\\n|$))+/gm,
                function(block) {
                    const items = block
                        .trim()
                        .split("\\n")
                        .map(function(item) {
                            return (
                                "<li>" +
                                item.substring(2) +
                                "</li>"
                            );
                        })
                        .join("");

                    return "<ul>" + items + "</ul>";
                }
            );

            // Ordered lists
            html = html.replace(
                /^(?:\\d+\\. .*(?:\\n|$))+/gm,
                function(block) {
                    const items = block
                        .trim()
                        .split("\\n")
                        .map(function(item) {
                            return (
                                "<li>" +
                                item.replace(
                                    /^\\d+\\. /,
                                    ""
                                ) +
                                "</li>"
                            );
                        })
                        .join("");

                    return "<ol>" + items + "</ol>";
                }
            );

            // Blockquotes
            html = html.replace(
                /^> (.*)$/gm,
                "<blockquote>$1</blockquote>"
            );

            // Horizontal rule
            html = html.replace(
                /^---$/gm,
                "<hr>"
            );

            // Paragraphs
            html = html
                .split(/\\n\\n+/)
                .map(function(block) {
                    block = block.trim();

                    if (!block) {
                        return "";
                    }

                    if (
                        block.startsWith("<h1>") ||
                        block.startsWith("<h2>") ||
                        block.startsWith("<h3>") ||
                        block.startsWith("<h4>") ||
                        block.startsWith("<ul>") ||
                        block.startsWith("<ol>") ||
                        block.startsWith("<blockquote>") ||
                        block.startsWith("<hr>") ||
                        block.startsWith(
                            '<div class="code-block">'
                        )
                    ) {
                        return block;
                    }

                    return (
                        "<p>" +
                        block.replace(
                            /\\n/g,
                            "<br>"
                        ) +
                        "</p>"
                    );
                })
                .join("");

            return html;
        }
    `;
}