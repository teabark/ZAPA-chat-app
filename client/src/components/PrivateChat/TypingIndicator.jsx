// src/components/chat/TypingIndicator.jsx
export default function TypingIndicator({ isTyping, name }) {
  return (
    isTyping && (
      <div style={{ fontSize: "13px", color: "#bbb", marginBottom: "5px" }}>
        {name || "User"} is typing...
      </div>
    )
  );
}
