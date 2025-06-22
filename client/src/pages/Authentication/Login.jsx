import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async () => {
  setLoading(true);
  setStatus("");

  try {
    const result = await signInWithPopup(auth, provider);
    const googleUser = result.user;

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.displayName,
        uid: googleUser.uid,
        photo: googleUser.photoURL,
      }),
    });

    const data = await response.json();

    if (data.message === "Verification email sent") {
      setStatus("📧 A verification email has been sent. Please check your inbox before continuing.");
    } else if (data.message === "User logged in") {
      localStorage.setItem("token", data.token); // optionally store token if returned
      navigate("/dashboard");
    } else {
      setStatus("⚠️ Unexpected response from server.");
    }
  } catch (err) {
    console.error("Login error:", err);
    setStatus("❌ Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#111",
          padding: "40px",
          borderRadius: "10px",
          width: "350px",
          textAlign: "center",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.05)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>ZAPA Login</h1>
        <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "30px" }}>
          Sign in with your Google account to continue
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {status && (
          <p
            style={{
              marginTop: "20px",
              fontSize: "13px",
              color: "#ccc",
              lineHeight: "1.5",
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
