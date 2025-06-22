import { useEffect, useRef, useState } from "react";
import socket from "../../utils/Socket";
import ChatHeaderBox from "./ChatHeaderBox";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";

export default function PrivateChat({ currentUser, selectedUser }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.VITE_BACKEND_URL}/api/messages/private?user1=${currentUser.uid}&user2=${selectedUser.uid}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();

    const handleReceive = (msg) => {
      const isMatch =
        (msg.senderId === currentUser.uid && msg.recipientId === selectedUser.uid) ||
        (msg.senderId === selectedUser.uid && msg.recipientId === currentUser.uid);
      if (isMatch) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    };

    const handleTyping = (uid) => {
      if (uid === selectedUser.uid) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // 🟢 Mark as read
    if (messages.length && selectedUser?.uid) {
      socket.emit("markAsRead", {
        senderId: selectedUser.uid,
        recipientId: currentUser.uid,
      });
    }
  }, [messages, selectedUser?.uid, currentUser.uid]);

  const sendMessage = () => {
    if (!text.trim() && !file) return;

    const msg = {
      senderId: currentUser.uid,
      recipientId: selectedUser.uid,
      content: file ? URL.createObjectURL(file) : text,
      timestamp: new Date(),
      type: file ? "image" : "text",
      read: false,
    };

    socket.emit("sendMessage", msg);
    setText("");
    setFile(null);
  };

  const handleTyping = () => {
    socket.emit("typing", {
      senderId: currentUser.uid,
      recipientId: selectedUser.uid,
    });
  };

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
      <ChatHeaderBox title={`Chat with ${selectedUser.name || selectedUser.email}`} />
      <TypingIndicator isTyping={isTyping} name={selectedUser.name} />
      <ChatMessages
        messages={messages}
        currentUser={currentUser}
        selectedUser={selectedUser}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput
        text={text}
        setText={setText}
        handleTyping={handleTyping}
        sendMessage={sendMessage}
        file={file}
        setFile={setFile}
      />
    </div>
  );
}
