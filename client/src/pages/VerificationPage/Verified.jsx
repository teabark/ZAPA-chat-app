// src/pages/Verified.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Verified() {
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    const verifyToken = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/auth/verify-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          // You can save token/user in localStorage or context
          localStorage.setItem("token", token);
          setStatus("✅ Verified! Redirecting...");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setStatus("❌ Verification failed. Link may have expired.");
        }
      } catch (err) {
        console.error(err);
        setStatus("❌ An error occurred during verification.");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus("❌ No token provided.");
    }
  }, [navigate]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#111",
      color: "#fff",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2>{status}</h2>
    </div>
  );
}

export default Verified;
