// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import socket from "../utils/Socket";

export default function Sidebar({ currentUser, onSelectUser, onSelectRoom }) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadPrivate, setUnreadPrivate] = useState({});
  const [unreadGroup, setUnreadGroup] = useState({});
  

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`);
      const data = await res.json();
      setUsers(data.filter((u) => u.uid !== currentUser.uid));
    };

    const fetchGroups = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/groups/my-groups/${currentUser.uid}`
      );
      const data = await res.json();
      setGroups(data);
    };

    const fetchUnreadCounts = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/unread/${currentUser.uid}`
      );
      const data = await res.json();

      const priv = {};
      data.privateUnread.forEach(({ _id, count }) => {
        priv[_id] = count;
      });

      const group = {};
      data.groupUnread.forEach(({ _id, count }) => {
        group[_id] = count;
      });

      setUnreadPrivate(priv);
      setUnreadGroup(group);
    };

    fetchUsers();
    fetchGroups();
    fetchUnreadCounts();
  }, [currentUser]);

  useEffect(() => {
    socket.emit("userOnline", currentUser.uid);

    socket.on("onlineUsers", (online) => {
      setOnlineUsers(online);
    });

    socket.on("receiveMessage", (msg) => {
      if (msg.recipientId === currentUser.uid) {
        setUnreadPrivate((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }

      if (msg.room) {
        setUnreadGroup((prev) => ({
          ...prev,
          [msg.room]: (prev[msg.room] || 0) + 1,
        }));
      }
    });

    socket.on("messagesRead", ({ from }) => {
      setUnreadPrivate((prev) => {
        const updated = { ...prev };
        delete updated[from];
        return updated;
      });
    });

    socket.on("groupMessagesRead", ({ roomId }) => {
      setUnreadGroup((prev) => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
      socket.off("messagesRead");
      socket.off("groupMessagesRead");
    };
  }, [currentUser.uid]);

  const toggleMember = (uid) => {
    setSelectedMembers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length === 0) return;

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/groups/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        creator: currentUser.uid,
        members: [...selectedMembers, currentUser.uid],
      }),
    });

    const newGroup = await res.json();
    setGroups((prev) => [...prev, newGroup]);
    setShowGroupForm(false);
    setGroupName("");
    setSelectedMembers([]);
  };

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        padding: "10px",
      }}
    >
      <h3>Chats</h3>

      <button
        onClick={() => setShowGroupForm(!showGroupForm)}
        style={{ marginBottom: "10px" }}
      >
        ➕ Create Group
      </button>

      {showGroupForm && (
        <div
          style={{ background: "#333", padding: "10px", marginBottom: "10px" }}
        >
          <input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {users.map((u) => (
              <div
                key={u.uid}
                onClick={() => toggleMember(u.uid)}
                style={{ cursor: "pointer", marginBottom: "5px" }}
              >
                <span
                  style={{
                    color: onlineUsers.includes(u.uid)
                      ? "lightgreen"
                      : "#aaa",
                  }}
                >
                  ●
                </span>{" "}
                {u.name || u.email}
              </div>
            ))}
          </div>
          <button onClick={handleCreateGroup} style={{ marginTop: "10px" }}>
            Create
          </button>
        </div>
      )}

      <h4>Private Chats</h4>
      {users.map((u) => (
        <div
          key={u.uid}
          onClick={() => {
            onSelectUser(u);
            setUnreadPrivate((prev) => {
              const updated = { ...prev };
              delete updated[u.uid];
              return updated;
            });
          }}
          style={{
            cursor: "pointer",
            marginBottom: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <span
              style={{
                color: onlineUsers.includes(u.uid) ? "lightgreen" : "#aaa",
              }}
            >
              ●
            </span>{" "}
            {u.name || u.email}
            {u.uid === currentUser.uid && " (You)"}
          </span>
          {unreadPrivate[u.uid] > 0 && (
            <span
              style={{
                backgroundColor: "red",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.8em",
              }}
            >
              {unreadPrivate[u.uid]}
            </span>
          )}
        </div>
      ))}

      <h4 style={{ marginTop: "10px" }}>Group Chats</h4>
      {groups.map((g) => (
        <div
          key={g._id}
          onClick={() => {
            onSelectRoom(g);
            setUnreadGroup((prev) => {
              const updated = { ...prev };
              delete updated[g._id];
              return updated;
            });
          }}
          style={{
            cursor: "pointer",
            marginBottom: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{g.name}</span>
          {unreadGroup[g._id] > 0 && (
            <span
              style={{
                backgroundColor: "red",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.8em",
              }}
            >
              {unreadGroup[g._id]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
