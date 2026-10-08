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

  // UI only
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const warmUpBackend = async () => {
    try {
      await fetch("https://lexia-api-v2.onrender.com/health");
      console.log("LEXIA backend warm-up request completed.");
    } catch (error) {
      console.error("LEXIA backend warm-up failed:", error);
    }
  };

  useEffect(() => {
    warmUpBackend();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return <div className="loading-screen">Loading LEXIA...</div>;
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
      const response = await fetch(
        "https://lexia-api-v2.onrender.com/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userQuestion: userMessage
          })
        }
      );

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

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* =========================
          Sidebar
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-top">

          <div className="sidebar-logo">
            <div className="logo-icon">L</div>

            {sidebarOpen && (
              <span className="logo-text">
                LEXIA
              </span>
            )}
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? "‹" : "›"}
          </button>

        </div>

        <div className="sidebar-content">

          <button
            className="new-chat-button"
            onClick={startNewChat}
          >
            <span className="new-chat-icon">+</span>

            {sidebarOpen && (
              <span>New chat</span>
            )}
          </button>

          {sidebarOpen && (
            <div className="sidebar-section">

              <div className="sidebar-section-title">
                Recent
              </div>

              {messages.length > 0 ? (
                <button className="history-item">
                  <span className="history-icon">◌</span>
                  <span className="history-text">
                    Current conversation
                  </span>
                </button>
              ) : (
                <div className="empty-history">
                  No recent chats
                </div>
              )}

            </div>
          )}

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              {session?.user?.email?.charAt(0).toUpperCase() || "U"}
            </div>

            {sidebarOpen && (
              <div className="user-info">
                <span className="user-name">
                  {session?.user?.email || "User"}
                </span>

                <span className="user-status">
                  Free account
                </span>
              </div>
            )}

          </div>

          {sidebarOpen && (
            <button
              className="sign-out-button"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              Sign out
            </button>
          )}

        </div>

      </aside>


      {/* =========================
          Main Application
      ========================= */}

      <div className="main-area">

        {/* Header */}

        <header className="top-bar">

          <div className="mobile-logo">

            <div className="logo-icon">
              L
            </div>

            <span>
              LEXIA
            </span>

          </div>

          <div className="top-status">

            <span className="status-dot"></span>

            <span>
              AI Assistant
            </span>

          </div>

        </header>


        {/* Chat */}

        <main className="chat-container">

          {messages.length === 0 && (

            <div className="welcome">

              <div className="welcome-icon">
                ✦
              </div>

              <h1>
                How can I help you?
              </h1>

              <p>
                Ask LEXIA anything.
              </p>

              <div className="suggestions">

                <button
                  onClick={() =>
                    setQuestion(
                      "Explain how FastAPI works"
                    )
                  }
                >
                  Explain FastAPI
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "Help me write a Python function"
                    )
                  }
                >
                  Write Python code
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "What is MVC architecture?"
                    )
                  }
                >
                  Explain MVC
                </button>

              </div>

            </div>

          )}


          {/* Messages */}

          {messages.map((message, index) => (

            <div
              key={index}
              className={`message ${message.role}`}
            >

              {message.role === "assistant" && (
                <div className="avatar">
                  L
                </div>
              )}

              <div className="message-content">

                {message.role === "assistant" ? (

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{

                      pre({ children }) {
                        return <>{children}</>;
                      },

                      code({
                        className,
                        children,
                        ...props
                      }) {

                        const match =
                          /language-([\w+-]+)/.exec(
                            className || ""
                          );

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

                        const code =
                          String(children).replace(
                            /\n$/,
                            ""
                          );

                        return (

                          <div className="code-block">

                            <div className="code-header">

                              <span>
                                {match[1]}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    code
                                  )
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

                  <p>
                    {message.content}
                  </p>

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


          {/* Loading */}

          {loading && (

            <div className="message assistant">

              <div className="avatar">
                L
              </div>

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


        {/* =========================
            Input
        ========================= */}

        <div className="input-wrapper">

          <div className="input-box">

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
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
              disabled={
                !question.trim() ||
                loading
              }
            >
              ↑
            </button>

          </div>

          <p className="disclaimer">
            LEXIA can make mistakes. Check important information.
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;