import { supabase } from "../lib/supabase";
import "./Sidebar.css";

function Sidebar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">L</div>
        <span>LEXIA</span>
      </div>

      <button className="new-chat-button">
        + New Chat
      </button>

      <div className="sidebar-spacer"></div>

      <button
        className="auth-logout-button"
        onClick={handleLogout}
      >
        ↪ Sign out
      </button>

    </aside>
  );
}

export default Sidebar;