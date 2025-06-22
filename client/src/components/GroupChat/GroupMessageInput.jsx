// src/components/chat/GroupMessageInput.jsx
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function GroupMessageInput({ currentUser, room, onSend, onTyping }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const sendMessage = () => {
    if (!text.trim() && !file) return;

    const msg = {
      senderId: currentUser.uid,
      senderName: currentUser.name || currentUser.email,
      room: room._id,
      content: file ? URL.createObjectURL(file) : text,
      timestamp: new Date(),
      type: file ? "image" : "text",
      readBy: [currentUser.uid],
    };

    onSend(msg);
    setText("");
    setFile(null);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={{ marginTop: 10 }}>
      {file && (
        <div style={{ marginBottom: 10 }}>
          <strong>Selected:</strong> {file.name}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <button onClick={() => setShowEmoji((prev) => !prev)} style={{ fontSize: "20px" }}>
          😊
        </button>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "#fff" }}
        />

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          placeholder="Type a message"
          style={{ padding: "8px", flex: 1 }}
        />

        <button onClick={sendMessage} style={{ padding: "8px 15px" }}>
          Send
        </button>
      </div>

      {showEmoji && (
        <div style={{ position: "absolute", bottom: "80px", zIndex: 10 }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}
    </div>
  );
}
