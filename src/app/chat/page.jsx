"use client";
import SendIcon from "@/../public/icons/send-message.png"
import style from "@/app/chat/globalChat.module.css";
import Image from "next/image";
import GlobalChat from "./globalChat/page";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function ChatHomePage() {
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
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

  // Socket.IO listener
  useEffect(() => {
    socket.on("message", (msg) => {
      setThreads(prev => [...prev, msg]);
      scrollToBottom();
    });
    return () => socket.off("message");
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threads]);

  const handleSend = async () => {
    if (!title.trim() && !body.trim()) return;

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const newThread = await res.json();

      if (!res.ok) throw new Error(newThread.error || "Failed to send");
      setTitle("");
      setBody("");
      socket.emit("message", newThread);
      scrollToBottom();
    }catch (err) {
      console.error(err);
      alert(err.message);
    };
  };

  return (
    <div className={style.container}>
      <div className={style.chatContainer}>
        <div className={style.messageDisplay}>
          <GlobalChat threads={threads} chatEndRef={chatEndRef} />
        </div>
        <div className={style.actionContainer}>
            <div className={style.inputsContainer}>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={style.inputTitle}
                    placeholder="Enter title..."
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <input
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    className={style.inputText}
                    placeholder="Enter text..."
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
            </div>
          <button onClick={handleSend} className={style.button}>
            <Image src={SendIcon} className={style.sendIcon} alt="sendIcon" />
          </button>
        </div>
      </div>
    </div>
  );
}