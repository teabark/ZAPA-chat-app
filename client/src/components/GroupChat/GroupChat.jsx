import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../../utils/Socket";
import GroupChatHeader from "./GroupChatHeader";
import GroupMessages from "./GroupMessages";
import TypingIndicator from "./TypingIndicator";
import GroupMessageInput from "./GroupMessageInput";

export default function GroupChat({ currentUser, room }) {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length && room._id && currentUser.uid) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room._id, userId: currentUser.uid }),
      });
    }
  }, [messages, room._id, currentUser.uid]);

  const handleReceive = useCallback(
    (msg) => {
      console.log("📨 Message received:", msg);
      if (msg.room !== room._id) return;

      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === msg._id);
        return alreadyExists ? prev : [...prev, msg];
      });
    },
    [room._id]
  );

  const handleTyping = useCallback(
    ({ senderId }) => {
      if (senderId === currentUser.uid) return;
      setTypingUsers((prev) =>
        prev.includes(senderId) ? prev : [...prev, senderId]
      );
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((id) => id !== senderId));
      }, 2000);
    },
    [currentUser.uid]
  );

  useEffect(() => {
    if (!currentUser?.uid || !room?._id) return;

    console.log("🧩 GroupChat mounted for room:", room._id);

    socket.emit("leaveRoom", room._id);
    socket.emit("joinRoom", room._id);

    socket.off("receiveMessage");
    socket.off("typing");

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/room/${room._id}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("❌ Failed to load group messages", err);
      }
    };

    fetchMessages();

    return () => {
      console.log("🔌 Cleaning up listeners for room:", room._id);
      socket.emit("leaveRoom", room._id);
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [room._id, currentUser?.uid, handleReceive, handleTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (msg) => {
    socket.emit("sendMessage", msg);
  };

  const triggerTyping = () => {
    socket.emit("typing", { senderId: currentUser.uid, room: room._id });
  };

  if (!room?._id) {
    return <p style={{ padding: 20, color: "#fff" }}>Loading group chat...</p>;
  }

  return (
    <div
      style={{
        flex: 1,
        background: "#111",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        color: "#fff",
      }}
    >
      <GroupChatHeader room={room} />
      <GroupMessages
        messages={messages}
        currentUser={currentUser}
        messagesEndRef={messagesEndRef}
      />
      <TypingIndicator typingUsers={typingUsers} />
      <GroupMessageInput
        currentUser={currentUser}
        room={room}
        onSend={sendMessage}
        onTyping={triggerTyping}
      />
    </div>
  );
}
