import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DashboardContent from "../../components/DashboardContext";
import socket from "../../utils/Socket";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Only redirect if token is completely missing
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          socket.emit("register", data.user.uid); // Re-register on refresh
        } else {
          console.warn("⚠️ Invalid token. Logging out.");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (err) {
        console.error("❌ Token verification failed:", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div style={{
        backgroundColor: "#111",
        color: "#fff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      flexDirection: "column",
      backgroundColor: "#111",
      minHeight: "100vh",
      fontFamily: "Arial",
    }}>
      <Header user={user} onLogout={handleLogout} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar
          onSelectUser={(u) => {
            setChatType("private");
            setChatTarget(u);
          }}
          onSelectRoom={(room) => {
            setChatType("group");
            setChatTarget(room);
          }}
          currentUser={user}
        />
<DashboardContent
  chatType={chatType}
  chatTarget={chatTarget}
  user={user}
/>
      </div>
    </div>
  );
}
