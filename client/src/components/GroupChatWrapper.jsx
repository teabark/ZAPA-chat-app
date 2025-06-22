// src/components/GroupChatWrapper.jsx
import { useEffect, useState } from "react";
import socket from "../utils/Socket";
import GroupChat from "./GroupChat/GroupChat";

export default function GroupChatWrapper({ currentUser, selectedRoom }) {
  const [group, setGroup] = useState(null);

useEffect(() => {
  const fetchGroup = async () => {
    if (!selectedRoom || !selectedRoom._id) return;

    console.log("📡 Fetching group by ID:", selectedRoom._id);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/groups/${selectedRoom._id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Group fetch failed:", data);
        return;
      }

      console.log("✅ Group fetched:", data);
      setGroup(data);
      socket.emit("joinRoom", data._id);
    } catch (err) {
      console.error("❌ Network error fetching group:", err);
    }
  };

  fetchGroup();
}, [selectedRoom]);


  if (!group) return <p style={{ color: "#888", padding: "20px" }}>Loading group...</p>;

  return <GroupChat currentUser={currentUser} room={group} />;
}
