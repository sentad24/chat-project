"use client";
import style from "@/app/chat/globalChat.module.css";

export default function GlobalChat({ threads, chatEndRef }) {
  return (
    <div className={style.commentSection}>
      {threads.map((thread)=> (
                   <div key={thread.id} className={style.comments}>
                        <div className={style.infoSection}>
                            <div className={style.profileImageContainer}>  
                                <div className={style.profileImage}></div>
                            </div>
                            <div className={style.userInfoContainer}>
                                <div className={style.userInfo}>
                                    <div className={style.userName}> {thread.username}</div>
                                    <div className={style.date}>{new Date(thread.created_at).toDateString()}</div>
                                </div>
                                <div className={style.titleContainer}>
                                    <div className={style.title}>{thread.title}</div>
                                </div>
                            </div>
                                
                        </div>
                        <div className={style.textBodyContainer}>
                            <div className={style.textBody}>{thread.body}</div>
                        </div>
                            
                   </div>
                ))}
      <div ref={chatEndRef}></div>
    </div>
  );
}

    