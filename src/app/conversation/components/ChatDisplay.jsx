"use client";
import { useState, useEffect,useRef } from "react";
import Image from "next/image";
import SendIcon from "@/../public/icons/send-message.png"
import style from "../../conversation/display/dispaly.module.css";

export default function ChatDisplay({ conversationId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const chatEndRef = useRef(null)

  const scrollToBottom = ()=>{
    chatEndRef.current?.scrollIntoView({ behavor: "smooth "})
  }
 

  async function loadMessages() {
    if (!conversationId) return;
  
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
  
      if (!res.ok) {
        console.error("Failed to fetch messages:", res.status);
        setMessages([]);
        return;
      }
  
      const text = await res.text(); 
      if (!text) {
        console.error("Empty response from API");
        setMessages([]);
        return;
      }
  
      const data = JSON.parse(text);
      if (data.error) {
        console.error("API error:", data.error);
        setMessages([]);
      } else {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        
      }
      setTimeout(scrollToBottom,50)
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages([]);
    }
  }
  

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  async function sendMessage() {
    if (!content.trim() || !currentUser) return;

    await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: conversationId,
        senderId: currentUser.id,
        content,
      }),
    });

    setContent("");
    
    loadMessages();
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], 
      { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, 
      });
    
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.chatDisplay}>
        {[...messages].map((m) => (
          <div key={m.id} className={style.chatMesssegeContainer}>
            <div className={style.infoMessagesContainer} >
              <div className={style.profileImageContainer}>
                <div className={style.profileImage}>
                  {m.avatar_public_id ? (
                    <img
                        src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${m.avatar_public_id}.png`}
                        alt="avatar"
                        className={style.profileImage}
                    />
                    ) : (
                    <span>{m.username?.charAt(0)?.toUpperCase() || "?"}</span>
                  )}
                </div>
              </div>
              <div>
                <div> 
                  <div key={m.id}> {m.username}</div>
                </div>
                <div className={style.date}>{formatDate(m.created_at)} </div>
              </div>  
            </div>
            <div className={style.messagesContainer}>
              <div className={style.messages}>{m.content}</div>
            </div>
          </div>
         
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className={style.actionContainer}>
        {!currentUser && <p style={{ color: "red" }}>Please log in to send messages</p>}
        <input
          className={style.inputText}
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={!currentUser}
        />
        <button
          className={style.button}
          onClick={sendMessage}
          disabled={!currentUser}
        >
          <span>
            <Image src={SendIcon} alt="sendIcon" className={style.sendIcon} />
            s
          </span>
        </button>
      </div>
    </div>
  );
}
