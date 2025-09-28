'use client'
import style from "@/app/chat/globalChat.module.css"
import { useState, useEffect } from "react"

export default function GlobalChat(){
    const [threads ,setThreads] = useState([]);

    useEffect(()=>{
        async function loadThreads(){
            const res = await fetch("/api/threads");
            const data = await res.json();
            setThreads(data)
        }
        loadThreads();
    },[]);



    return(
        <div className={style.comentSection}>
           <div className={style.coments} >
                {threads.map((thread)=> (
                    <li key={thread.id}>
                    <strong>{thread.title}</strong> — {thread.body} {new Date(thread.created_at).toLocaleDateString()}
                  </li>
                ))}
           </div>
        
        </div>
    )
}