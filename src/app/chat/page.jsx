"use client";
import SendIcon from "@/../public/icons/send-message.png"
import style from "@/app/chat/globalChat.module.css";
import Image from "next/image";
import GlobalChat from "./globalChat/page";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")

export default function ChatHomePage() {
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  // Load messages on mount
  useEffect(() => {
    async function loadThreads() {
      const res = await fetch("/api/threads");
      const data = await res.json();
      setThreads(data);
      scrollToBottom();
    }
    loadThreads();
  }, []);


  useEffect(() =>{
    socket.on("message", (msg) => {
        setThreads((prev) => [...prev, msg])
        scrollToBottom
    });
    return () => socket.off("massage");
  }, [])


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
    useEffect(() => {
        scrollToBottom();
    }, [threads]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: message, body: "" }),
      });

      const newThread = await res.json();
      if (!res.ok) throw new Error(newThread.error || "Failed to send");

      setMessage("");
      setThreads(prev => [...prev, newThread]); // append to bottom
      scrollToBottom();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.chatContainer}>
        <div className={style.messageDisplay}>
          <GlobalChat threads={threads} chatEndRef={chatEndRef} />
        </div>
        <div className={style.actionContainer}>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={style.placeholder}
            placeholder="Type a message..."
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className={style.button}>
            <Image src={SendIcon} className={style.sendIcon} alt="sendIcon" />
          </button>
        </div>
      </div>
    </div>
  );
}
