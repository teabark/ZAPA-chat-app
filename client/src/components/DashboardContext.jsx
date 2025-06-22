import PrivateChatWrapper from "./PrivateChatWrapper";
import GroupChatWrapper from "./GroupChatWrapper";

export default function DashboardContent({ chatType, chatTarget, user }) {
  if (!chatType || !chatTarget) {
    return <p style={{ color: "#aaa", padding: "20px" }}>Select a chat to begin</p>;
  }

  return chatType === "private" ? (
    <PrivateChatWrapper currentUser={user} selectedUser={chatTarget} />
  ) : (
    <GroupChatWrapper currentUser={user} selectedRoom={chatTarget} />
  );
}
