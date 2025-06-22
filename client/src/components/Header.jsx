import { useState } from "react";

export default function Header({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#1a1a1a",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "1px solid #333"
    }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>ZAPA</h1>

      <div style={{ position: "relative" }}>
        <button
          onClick={toggleDropdown}
          style={{
            background: "transparent",
            border: "1px solid #555",
            borderRadius: "5px",
            padding: "8px 14px",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Menu ⌄
        </button>

        {showDropdown && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "110%",
            backgroundColor: "#222",
            border: "1px solid #333",
            borderRadius: "5px",
            minWidth: "150px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 999
          }}>
            <button
              style={dropdownItemStyle}
              onClick={() => alert("Settings clicked")}
            >
              ⚙️ Settings
            </button>
            <button
              style={dropdownItemStyle}
              onClick={onLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const dropdownItemStyle = {
  background: "none",
  border: "none",
  color: "#fff",
  padding: "10px 15px",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "15px"
};
