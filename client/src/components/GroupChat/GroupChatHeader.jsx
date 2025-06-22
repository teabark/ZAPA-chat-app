// src/components/chat/GroupChatHeader.jsx
export default function GroupChatHeader({ room }) {
  return (
    <h3 style={{ marginBottom: "10px" }}>
      Group: {room?.name || "Unnamed"}
    </h3>
  );
}
