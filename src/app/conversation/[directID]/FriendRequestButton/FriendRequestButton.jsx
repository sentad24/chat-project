"use client"

import { useState } from "react"

export default function FriendRequestButton({senderId, receiverId}){
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")

    const sendRequest = async () => {
        setLoading(true)
        setStatus("")
    
        try{
            const res = await fetch("/api/friends/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({senderId,receiverId})
            });
    
            const data = await res.json()
            
            if (res.ok) {
                setStatus("Friend request sent!");
            } else {
                setStatus("Error: " + data.error);
            }
    
        } catch(error){
            setStatus("Error sending request")
        }
    
            setLoading(false)
        }

        return (
            <div>
                
              <button onClick={sendRequest} disabled={loading}>
                {loading ? "Sending..." : "Add Friend"}
              </button>
              {status && <p>{status}</p>}
            </div>
          );


}


