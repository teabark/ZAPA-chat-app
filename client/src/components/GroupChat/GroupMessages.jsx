export default function GroupMessages({ messages, currentUser, messagesEndRef }) {
  if (!Array.isArray(messages)) {
    return <p style={{ color: "#888" }}>No messages yet...</p>;
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        margin: "10px 0",
        paddingRight: "10px",
      }}
    >
      {messages.map((msg, idx) => {
        const isOwn = msg.senderId === currentUser.uid;
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: isOwn ? "flex-end" : "flex-start",
              marginBottom: "10px",
              flexDirection: "column",
              alignItems: isOwn ? "flex-end" : "flex-start",
            }}
          >
            {!isOwn && (
              <div
                style={{
                  fontSize: "0.85em",
                  color: "#aaa",
                  marginBottom: "2px",
                  marginLeft: "5px",
                }}
              >
                {msg.senderName}
              </div>
            )}
            <div
              style={{
                maxWidth: "60%",
                padding: "10px",
                borderRadius: "10px",
                background: isOwn ? "#0b93f6" : "#333",
                color: "#fff",
              }}
            >
              <div>
                {msg.type === "image" ? (
                  <img
                    src={msg.content}
                    alt="sent"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#ccc",
                  textAlign: "right",
                  marginTop: 4,
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
                {isOwn && msg.readBy?.length > 1 && (
                  <span style={{ marginLeft: 6 }}>✔ Read</span>
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
