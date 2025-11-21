'use client'
import { useEffect, useState } from "react"
import FriendRequestButton from "../FriendRequestButton/FriendRequestButton"

import Style from "../../conversation.module.css"

export default function DirectIdClient({currentUser}){
    currentUser = currentUser ?? {}
    const [activeTab,setActiveTab] = useState("friends")
    const [searchQuery, setSearchQuery] = useState("")
    const [findUsers,setFindeUsers] = useState([])
    const [requests, setRequests] = useState([])
    const [friends, setFriends] = useState([])
    
    
    useEffect(()=>{
        async function loadUsers() {
            const res = await fetch("/api/users")
            const data = await res.json() 
            setFindeUsers(data)
        }
        loadUsers()
    }, [])
    useEffect(() => {
        console.log("Loaded users:", findUsers)
    }, [findUsers])

    useEffect(()=> {
        async function loadRequests(){
            if(!currentUser?.id ) return;

            const res = await fetch(`/api/friends/request?userId=${currentUser.id}`)
            const data = await res.json()
            setRequests(data)
        }
        loadRequests()
    },[currentUser])
    useEffect(()=> {
     async function loadFriends(){
        if (!currentUser?.id) return;

        const res = await fetch(`/api/friends/list?userId=${currentUser.id}`)
        if (!res.ok) {
            console.error("Failed to fetch friends:", res.status, await res.text());
            return;
        }
        
        const data = await res.json()
        setFriends(Array.isArray(data) ? data : [])
     }
     loadFriends()
    },[])




    async function acceptRequest(senderId, receiverId) {
        await fetch("/api/friends/accept", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ senderId, receiverId })
        });
        setRequests(reqs => reqs.filter(r => r.sender_id !== senderId || r.receiver_id !== receiverId));
    }
    
    async function declineRequest(senderId, receiverId) {
        await fetch("/api/friends/decline", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ senderId, receiverId })
        });
        setRequests(reqs => reqs.filter(r => r.sender_id !== senderId || r.receiver_id !== receiverId));
    }

    const filterList = (list) => 
        list.filter(user => 
            user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

 return(
    <div>
        <section className={Style.directSection}>
            <div className={Style.searchFriendsSection}>
                <div className={Style.inputBarContainer}>
                    <input className={Style.inputBar}  
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className={Style.friendTabsBtns}>
                <button onClick={()=> setActiveTab("friends")}>My Friends</button>
                <button onClick={()=> setActiveTab("addFriends")}>Add Frindes</button>
                <button onClick={()=> setActiveTab("requests")}>Requests</button>
                
            </div>
            <main className={Style.dispalyUsers}>
                {activeTab === "friends" && (
                    <div>
                        <h2>Friends</h2>
                        {friends.length === 0 && <p>No friends yet</p>}
                        <ul>
                            {friends.map(f => {
                                const friendUsername =
                                f.sender_id === currentUser.id ? f.receiver_username : f.sender_username;
                                return <li key={f.id}>{friendUsername}</li>;
                            })}
                        </ul>
                    </div>
                )}

                {activeTab === "addFriends" && (
                    <div>
                        <h2> Add friends</h2>
                        
                        {!currentUser?.id ? ( <p>You must be logged in to send a friend request</p> ) : (
                            filterList(findUsers).map((u, index) => (
                                <div key={u.id ?? index}>
                                    <li>{u.username}</li>
                                    <FriendRequestButton
                                        senderId={currentUser.id}
                                        receiverId={u.id}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                )}
                {activeTab === "requests" && (
                    <div>
                        <h2>Friend Requests</h2>
                        {requests.length === 0 && <p>No pending requests</p>}

                        {requests.map((req,index) => (
                            <div key={req.id ?? index}>
                                <p>{req.username} wants to be your friend</p>
                                <button onClick={() => acceptRequest(req.sender_id, currentUser.id)}>Accept</button>
                                <button onClick={() => declineRequest(req.sender_id, currentUser.id)}>Decline</button>
                            </div>
                        ))}
                    </div>
                    )}

            </main>
        </section>

    </div>
    
 )
}