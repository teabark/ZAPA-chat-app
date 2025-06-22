// src/components/chat/ChatMessages.jsx
import React from "react";

export default function ChatMessages({ messages, currentUser, selectedUser, messagesEndRef }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", margin: "10px 0", paddingRight: "10px" }}>
      {messages.map((msg, idx) => {
        const isOwn = msg.senderId === currentUser.uid;
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: isOwn ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "60%",
                padding: "10px",
                borderRadius: "10px",
                background: isOwn ? "#0b93f6" : "#444",
                color: "#fff",
              }}
            >
              {msg.type === "image" ? (
                <img
                  src={msg.content}
                  alt="sent"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              ) : (
                <span>{msg.content}</span>
              )}
              <div style={{ fontSize: 10, color: "#ccc", textAlign: "right", marginTop: 4 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
                {isOwn && (
                  <span style={{ marginLeft: 5, color: msg.read ? "#00f" : "#aaa" }}>✔✔</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
