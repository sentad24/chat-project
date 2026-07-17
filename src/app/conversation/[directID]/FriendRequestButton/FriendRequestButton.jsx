"use client"
import { socket } from "@/lib/socket";
import style from "./FriendRequestButton.module.css"
import Image from "next/image"
import { useState } from "react"

export default function FriendRequestButton({ senderId, receiverId, onRequestSent }) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [status, setStatus] = useState("")

 

    const sendRequest = async () => {
        if (sent) return

        setLoading(true)
        setStatus("")

        try {
            const res = await fetch("/api/friends/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId, receiverId })
            })

            const data = await res.json()
           

            if (res.ok) {
                socket.emit(
                    "send-friend-request",
                    {
                        senderId,
                        receiverId
                    }
                );
                setSent(true)
                setStatus("Friend request sent!")
                setTimeout(()=>{
                    if (onRequestSent) onRequestSent()
                },3000)
            } else {
                setStatus("Error: " + data.error)
            }

        } catch (error) {
            setStatus("Error sending request")
        }

        setLoading(false)
    }

    return (
        <div className={style.container}>
            <button className={style.btn} onClick={sendRequest} disabled={loading}>
                {loading ? (
                    "..."
                ) : sent ? (
                    <Image src="/icons/mark.png" alt="check icon" width={20} height={20} />
                ) : (
                    <Image src="/icons/add-user.png" alt="add user icon" width={20} height={20} />
                )}
            </button>
            
        </div>
    )
}
