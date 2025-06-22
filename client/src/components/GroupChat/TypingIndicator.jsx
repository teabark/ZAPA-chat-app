// src/components/chat/TypingIndicator.jsx
export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers.length) return null;

  return (
    <div style={{ fontSize: "13px", color: "#bbb", marginBottom: "5px", paddingLeft: "10px" }}>
      {typingUsers.length === 1
        ? "Someone is typing..."
        : `${typingUsers.length} people are typing...`}
    </div>
  );
}
