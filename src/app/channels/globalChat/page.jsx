"use client";
import Image from "next/image";
import style from "@/app/channels/globalChat.module.css";
import DeleteImg from "@/../public/icons/delete.png";
import { getSession} from "next-auth/react"
import { useEffect, useState, useRef } from "react";
import {io} from "socket.io-client"

const socket = io("http://localhost:4000")

export default function GlobalChat({ threads, initialComments}) {
    const[threadState, setThreadState] = useState(initialComments || threads )
    const chatEndRef = useRef(null);
   
    useEffect(()=> {
        if(initialComments?.length) setThreadState(initialComments)
        else if (threads?.length) setThreadState(threads)
        
    },[threads,initialComments])



    useEffect(() => {
        socket.on("connect", () => {
            // console.log("Connected socket on", socket.id )
        })

        socket.on("deleteMessage", ({id}) =>{
            setThreadState((prev) => prev.filter((t) => t.id !== id))
        })
    },[])
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };
    useEffect(() => {
        scrollToBottom()
    }, [setThreadState])


    const handleDelete = async (id) => {
        console.log("Deleting thread with ID:", id);

        try {
          const res = await fetch(`/api/threads/${id}`, {
            method: "DELETE",
            credentials: "include"
          });
          const data = await res.json();
      
          if (!res.ok) throw new Error(data.message || "Failed to delete comment");
      
          // Update state
          setThreadState((prev) => prev.filter((t) => t.id !==id))
          socket.emit("deleteMessage", {id})
       
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
    };


  return (
    <div className={style.commentSection}>
        {[...threadState].reverse().map((thread) => (
            <div key={thread.id} className={style.comments}>
                <div className={style.infoSection}>
                    <div className={style.profileImageContainer}>
                        <div className={style.profileImage}></div>
                    </div>
                    <div className={style.userInfoContainer}>
                        <div className={style.userInfo}>
                            <div className={style.userName}>{thread.username}</div>
                            <div className={style.date}>{new Date(thread.created_at).toDateString()}</div>
                            <button className={style.deleteButton} onClick={() => confirm("Are you sure") && handleDelete(thread.id)}>
                                <Image src={DeleteImg} width={15} height={15} alt="deleteIcon" />
                            </button>
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
