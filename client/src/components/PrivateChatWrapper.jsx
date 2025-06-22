import { useEffect, useState } from "react";
import PrivateChat from "./PrivateChat/PrivateChat";

export default function PrivateChatWrapper({ currentUser, selectedUser }) {
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!selectedUser?.uid) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${selectedUser.uid}`);
        const data = await res.json();
        setTargetUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, [selectedUser]);

  if (!targetUser) {
    return <p style={{ color: "#aaa", padding: "20px" }}>Loading chat...</p>;
  }

  return <PrivateChat currentUser={currentUser} selectedUser={targetUser} />;
}
