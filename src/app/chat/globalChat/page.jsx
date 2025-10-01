
"use client";
import style from "@/app/chat/globalChat.module.css";


export default function GlobalChat({ threads, chatEndRef }) {
  return (
    <div className={style.commentSection}>
      {threads.map(thread => (
        <div key={thread.id} className={style.comments}>
          <div className={style.userInfo}>
            <div className={style.userName}>{thread.username}</div>
            <div className={style.date}>{new Date(thread.created_at).toLocaleString()}</div>
          </div>
          <div className={style.textBody}>{thread.title}</div>
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
}
