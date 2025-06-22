import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerified() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000); // wait 3 seconds before redirecting

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>✅ Email Confirmed</h1>
      <p style={{ fontSize: "14px", color: "#ccc" }}>Redirecting to dashboard...</p>
    </div>
  );
}
