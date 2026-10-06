
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/auth/Auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

function App() {


  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {

      setSession(data.session);
      setAuthLoading(false);

    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setSession(session);

      }
    );

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  if (authLoading) {
    return <div>Loading LEXIA...</div>;
  }

  if (!session) {
    return <Auth />;
  }





  const askAI = async () => {
    if (!question.trim() || loading) return;

    const userMessage = question.trim();

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("https://lexia-api-v2.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userQuestion: userMessage
        })
      });

      const data = await response.json();

      console.log("AI RESPONSE:", data.answer);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer,
          provider: data.provider
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <header className="top-bar">

        <div className="logo">
          <div className="logo-icon">L</div>
          <span>LEXIA</span>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Assistant
        </div>

      </header>

      <main className="chat-container">

        {messages.length === 0 && (
          <div className="welcome">

            <div className="welcome-icon">✦</div>

            <h1>How can I help you?</h1>

            <p>Ask LEXIA anything.</p>

            <div className="suggestions">

              <button
                onClick={() =>
                  setQuestion("Explain how FastAPI works")
                }
              >
                Explain FastAPI
              </button>

              <button
                onClick={() =>
                  setQuestion("Help me write a Python function")
                }
              >
                Write Python code
              </button>

              <button
                onClick={() =>
                  setQuestion("What is MVC architecture?")
                }
              >
                Explain MVC
              </button>

            </div>

          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
          >

            {message.role === "assistant" && (
              <div className="avatar">L</div>
            )}

            <div className="message-content">

              {message.role === "assistant" ? (
                <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    pre({ children }) {
      return <>{children}</>;
    },

    code({ className, children, ...props }) {
      const match = /language-([\w+-]+)/.exec(className || "");

      if (!match) {
        return (
          <code
            className={className}
            {...props}
          >
            {children}
          </code>
        );
      }

      const code = String(children).replace(/\n$/, "");

      return (
        <div className="code-block">

          <div className="code-header">
            <span>{match[1]}</span>

            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(code)
              }
            >
              Copy
            </button>
          </div>

          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="pre"
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "#282c34",
              whiteSpace: "pre",
              overflowX: "auto"
            }}
            codeTagProps={{
              style: {
                whiteSpace: "pre"
              }
            }}
          >
            {code}
          </SyntaxHighlighter>

        </div>
      );
    }
  }}
>
  {message.content}
</ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}

              {message.provider && (
                <div className="provider">

                  <span className="provider-dot"></span>

                  {message.provider}

                </div>
              )}

            </div>

          </div>
        ))}

        {loading && (
          <div className="message assistant">

            <div className="avatar">L</div>

            <div className="message-content">

              <div className="typing">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>

          </div>
        )}

      </main>

      <div className="input-wrapper">

        <div className="input-box">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
            placeholder="Message LEXIA..."
            rows="1"
          />

          <button
            className="send-button"
            onClick={askAI}
            disabled={!question.trim() || loading}
          >
            ↑
          </button>

        </div>

        <p className="disclaimer">
          Powered by AI.
        </p>
        <button
            className="auth-logout-button"
            onClick={async () => {
                await supabase.auth.signOut();
            }}
        >
            Sign out
        </button>

      </div>

    </div>
  );
}

export default App
