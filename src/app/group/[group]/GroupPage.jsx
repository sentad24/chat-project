"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../group.module.css";
import SendIcon from "@/../public/icons/send-message.png"

export default function GroupPage({ groupId, currentUser }) {
  const [group, setGroup] = useState({});
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const groupRes = await fetch(`/api/groups/${groupId}`);
        if (!groupRes.ok) throw new Error(`Group fetch failed: ${groupRes.status}`);
        const groupData = await groupRes.json();
        setGroup(groupData.group || {});
        setMembers(groupData.members || []);

        
        const messagesRes = await fetch(`/api/groups/${groupId}/messages`);
        if (!messagesRes.ok) throw new Error(`Messages fetch failed: ${messagesRes.status}`);
        const messagesData = await messagesRes.json();
        setMessages(Array.isArray(messagesData) ? messagesData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load group or messages");
        setMessages([]);
        setGroup({});
        setMembers([]);
      } finally {
        setLoading(false);
      }
      console.log("currentUser in GroupPage:", currentUser);
    }

    loadData();
  }, [groupId]);

  async function sendMessage() {

    if(!currentUser?.id){
      console.warn("User not logged in")
      return;
    }

    if (!text.trim()) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, senderId: currentUser.id, }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const newMessage = await res.json();
      setMessages(prev => [...prev, newMessage]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
   
  }

  const formatDate = (dateString) =>{
    const date = new Date(dateString)
    return date.toLocaleTimeString([],{
      month:'short',
      day:'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  if (loading) return <p>Loading group...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.members}>
        <h3 className={styles.groupName}>{group?.group_name || "Group"}</h3>
        {members.map(m => (
          <div key={m.id} className={styles.groupMembersContainer} >
              <div className={styles.profileImage}>
              {m.avatar_public_id ? (
                  <img
                      src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${m.avatar_public_id}`}
                      alt="avatar"
                      className={styles.profileImage}
                  />
                  ) : (
                  <span>{m.username?.charAt(0)?.toUpperCase() || "?"}</span>
              )}
              </div>
            {m.username}
            </div>
        ))}
      </aside>

      <main className={styles.chat}>
        <div className={styles.messagesContainer}>
          {messages.map(m => (
            <div className={styles.messages} key={m.id}>
              <div className={styles.userInfoContainer}>
                <div className={styles.profileImage}>
                  {m.avatar_public_id ? (
                    <img
                        src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${m.avatar_public_id}.png`}
                        alt="avatar"
                        className={styles.profileImage}
                    />
                    ) : (
                    <span>{m.username?.charAt(0)?.toUpperCase() || "?"}</span>
                 )}

                </div>
                <b>{m.username}</b>
                <div className={styles.date}>{formatDate(m.created_at)}</div>

              </div>
              <div className={styles.messageContainer}>
                <span className={styles.message}>{m.message}</span>
              </div>
              
            </div>
          ))}
        </div>

        <div className={styles.inputsContainer}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type message..."
            className={styles.inputBar}
          />
          <button className={styles.button} onClick={sendMessage}> <Image className={styles.SendIcon} alt="sendIcon" src={SendIcon}/></button>
        </div>
      </main>
    </div>
  );
}
