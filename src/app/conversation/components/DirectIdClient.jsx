'use client'
import { useEffect, useState } from "react"
import FriendRequestButton from "@/app/conversation/[directID]/FriendRequestButton/FriendRequestButton"
import Style from "@/app/conversation/conversation.module.css"
import { redirect } from "next/navigation"

export default function DirectIdClient({currentUser, conversationId}){
    currentUser = currentUser ?? {}
    const [activeTab,setActiveTab] = useState("friends")
    const [searchQuery, setSearchQuery] = useState("")
    const [findUsers,setFindeUsers] = useState([])
    const [requests, setRequests] = useState([])
    const [friends, setFriends] = useState([])
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName]= useState("")

   
    useEffect(() => {
        async function loadAvailableUsers() {
          if (!currentUser?.id) return;
      
          const res = await fetch(`/api/users/available?userId=${currentUser.id}`);
          if (!res.ok) return;
      
          const data = await res.json();
          setFindeUsers(data); 
        }
      
        loadAvailableUsers();
      }, [currentUser]);
      
    useEffect(() => {
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
        
        const data = await res.json();

        const filteredFriends = data.filter(
        (friend) => friend.friend_id !== currentUser.id
        );

        console.log("FRIENDS WITHOUT SELF:", filteredFriends);

        setFriends(Array.isArray(filteredFriends) ? filteredFriends : []);
     }
     loadFriends()
    },[currentUser?.id])




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
    async function startConversation(friendId) {
        if (!currentUser?.id) return
    
        const res = await fetch("/api/conversation/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            user1: currentUser.id, 
            user2: friendId }),
        })
    
        const data = await res.json()
        if (data?.id) {
             window.location.href = `/conversation/${data.id}`
        }
    }


    const filterList = (list) =>
        list.filter(f => {
          const username = f.friend_username || "";
          return username.toLowerCase().includes(searchQuery.toLowerCase());
        });
      


    const filterUsers = (list) => 
        list.filter(f => (f.friend_username || "").toLowerCase().includes(searchQuery.toLowerCase()));

    function removeUser(userId){
        setFindeUsers(perv => perv.filter(u => u.id !== userId))
    }
    const uniqueFriends = friends.filter(
        (f, index, self) =>
          index === self.findIndex(
            t => t.friend_id === f.friend_id
        )
    );
    const toggleFriend = (id) => {
        setSelectedFriends((prev) =>
          prev.includes(id)
            ? prev.filter((f) => f !== id) 
            : [...prev, id]               
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            name: groupName,
            members: selectedFriends,
            createdBy: currentUser?.id,
          };
          
          console.log("PAYLOAD:", payload);
          
          const res = await fetch("/api/groups/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          
          const data = await res.json();
          
          console.log("RESPONSE:", data);
    
        if (res.ok) {
            redirect(`/group/${data.groupId}`);
        } else {
            alert(data.error || "Failed to create group");
        }
    };
    // useEffect(()=>{
    //     async function fetchMe() {
    //         const res = await fetch("/api/me")
    //         if(!res.ok) return
    //         const data = await res.json()
    //         setUser(data.user)     
    //     }
    //     fetchMe()
    // }, [])
    
    

 return(
    <>
        <section className={Style.directSection}>
                <div className={Style.inputBarContainer}>
                    <input className={Style.inputBar}  
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            <div className={Style.friendTabsBtns}>
                <button className={`${Style.friendTabsBtn} ${activeTab === "friends" ? Style.activeTab: ""}`} onClick={()=> setActiveTab("friends")}><span> <img src="/icons/friends.png" style={{height:'20px'}} /></span></button>
                <button className={`${Style.friendTabsBtn} ${ activeTab === "addFriends" ? Style.activeTab: ""}`} onClick={()=> setActiveTab("addFriends")}><span><img src="/icons/add-friend.png"style={{height:'20px'}}/></span></button>
                <button className={`${Style.friendTabsBtn} ${ activeTab === "requests" ? Style.activeTab: ""}`} onClick={()=> setActiveTab("requests")}> <div className={Style.reqCouter}>{requests.length > 0 && `${requests.length}`} </div><img src="/icons/user.png"style={{height:'20px'}}/></button>
                <button className={`${Style.friendTabsBtn} ${ activeTab === "createGroupChat" }`} onClick={()=> setActiveTab("createGroupChat")}><div className={Style.createGroup}>+</div></button>

            </div>
            <main className={Style.mainContainerDisplayUsers}>
                
                {activeTab === "friends" && (
                    <div className={Style.friendsSection}>
                        <h2>Friends</h2>
                        

                        {friends.length === 0 && <p>No friends yet</p>}
                        
                        {filterList(uniqueFriends).map(f => (
                        <li key={f.friend_id} className={Style.friendListItem}>
                            <div
                            className={Style.friendButton}
                            onClick={() => startConversation(f.friend_id)}
                            role="button"
                            tabIndex={0}
                            >
                            <div className={Style.profilImg}>
                                {f.avatar_public_id ? (
                                    <img
                                        src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${f.avatar_public_id}`}
                                        alt="avatar"
                                        className={Style.profileImage}
                                        width={40}
                                        height={40}
                                        style={{"borderRadius" : "50%"}}
                                    />
                                    ) : (
                                    <span>{f.friend_username?.charAt(0)?.toUpperCase() || "?"}</span>)
                                }
                            </div>
                            <span className={Style.friendName}>{f.friend_username}</span>
                            </div>
                        </li>
                        ))}
                        
                    </div>
                )}


                {activeTab === "addFriends" && (
                    <div className={Style.addFriendsSection}>
                        <h2> Add friends</h2>
                        
                        {!currentUser?.id ? ( <p>You must be logged in to send a friend request</p> ) : (
                            filterUsers(findUsers).map((u, index) => (
                                <div className={Style.findeUsersSection} key={u.id ?? index}>
                                    <div className={Style.profilImg}>
                                        {u.avatar_public_id ? (
                                            <img
                                                src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${u.avatar_public_id}.png`}
                                                alt="avatar"
                                                className={Style.profileImage}
                                            />
                                            ) : (
                                            <span>{u.username?.charAt(0)?.toUpperCase() || "?"}</span>
                                        )}
                                    </div>
                                    <li className={Style.findUserName}>{u.username}</li>
                                    <FriendRequestButton
                                        senderId={currentUser.id}
                                        receiverId={u.id}
                                        onRequestSent={() => removeUser(u.id)}
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
                           
                            <div className={Style.friendReqContainer} key={req.id ?? index}>
                                
                                <div className={Style.imgAndName}>
                                    <div className={Style.profilImg}>
                                        {req.avatar_public_id ? (
                                            <img
                                                src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${req.avatar_public_id}`}
                                                alt="avatar"
                                                className={Style.profileImage}
                                                width={40}
                                                height={40}
                                                style={{"borderRadius" : "50%"}}
                                            />
                                            ) : (
                                            <span>{req.username?.charAt(0)?.toUpperCase() || "?"}</span>
                                        )}
                                    </div>
                                    <p className={Style.friReqName}>{req.username}</p>
                                </div>
                                <div className={Style.btnsSection}>
                                    <button className={Style.actBtn} onClick={() => acceptRequest(req.sender_id, currentUser.id)}>Accept</button>
                                    <button className={Style.decBtn} onClick={() => declineRequest(req.sender_id, currentUser.id)}>X</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                    {activeTab === "createGroupChat" && (
                      <div className={Style.createFromContainer}>
                        <form onSubmit={handleSubmit}>
                          <label>Create groupChat</label>

                          <input
                            type="text"
                            placeholder="Enter a name..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                          />

                          <h3>Add friends</h3>

                          <div className={Style.friendsList}>
                                {uniqueFriends.map((f) => (
                                    <div
                                    key={f.friend_id}
                                    className={`${Style.friendItem} ${
                                        selectedFriends.includes(f.friend_id) ? Style.selected : ""
                                    }`}
                                    onClick={() => toggleFriend(f.friend_id)}
                                    >
                                    <div className={Style.profilImg}>
                                        {f.avatar_public_id ? (
                                            <img
                                                src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${f.avatar_public_id}.png`}
                                                alt="avatar"
                                                className={Style.profileImage}
                                                width={40}
                                                height={40}
                                                style={{"borderRadius" : "50%"}}
                                            />
                                            ) : (
                                            <span>{f.friend_username?.charAt(0)?.toUpperCase() || "?"}</span>
                                        )}
                                    </div>

                                    <span className={Style.username}>
                                        {f.friend_username}
                                    </span>
                                    </div>
                                ))}
                            </div>

                        
                          <div className={Style.actions}>
                            <button type="submit" className={Style.createBtn}>
                              Create
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

            </main>
        </section>

    </>
    
 )
}