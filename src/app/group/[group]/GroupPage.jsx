"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../group.module.css";
import SendIcon from "@/../public/icons/send-message.png"
import SettingIcon from "@/../public/icons/settings.png"


export default function GroupPage({ groupId, currentUser }) {
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState({});
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false)

  const [selectedFriends, setSelectedFriends] = useState([]);
  // const [settingsTabOpen, setSettingsTabOpen] = useState(false)

  const openRef = useRef(null)
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const groupRes = await fetch(`/api/groups/${groupId}`, {
          credentials: "include",
        });
        if (!groupRes.ok) throw new Error(`Group fetch failed: ${groupRes.status}`);
        const groupData = await groupRes.json();
        setGroup(groupData.group || {});
        setMembers(groupData.members || []);

        
        const messagesRes = await fetch(
          `/api/groups/${groupId}/messages`,
          {
            credentials: "include",
          }
        );
        if (!messagesRes.ok) throw new Error(`Messages fetch failed: ${messagesRes.status}`);
        const messagesData = await messagesRes.json();
        setMessages(Array.isArray(messagesData) ? messagesData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load group or messages");
        setMessages([]);
        setGroup({});
        setMembers([]);
      } finally {
        setLoading(false);
      }
      console.log("currentUser in GroupPage:", currentUser);
    }

    loadData();
  }, [groupId]);

  useEffect(()=>{
    function handleMouseDown(e) {
      if(openRef.current && !openRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown" , handleMouseDown)

    return ()=> {
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  async function sendMessage() {

    if(!currentUser?.id){
      console.log("User not logged in")
      return;
    }

    if (!text.trim()) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, senderId: currentUser.id, }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const newMessage = await res.json();
      setMessages(prev => [...prev, newMessage]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
   
  }

  const formatDate = (dateString) =>{
    const date = new Date(dateString)
    return date.toLocaleTimeString([],{
      month:'short',
      day:'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  useEffect(()=>{
    if (!currentUser?.id) return;

    async function getUsers() {
      try{
        const res = await fetch(`/api/friends/list?userId=${currentUser.id}`)
        if(!res.ok) throw new Error("Faild to fetch friends")
        
        const data = await res.json()

        const cleaned = Array.from(
          new Map(
            data
              .filter(f => f.friend_id !== currentUser.id && 
                !members.some(member => member.id === f.friend_id)
              )
              .map(f => [f.friend_id, f])
          ).values()
        );
  
        setFriends(cleaned);
      }
      catch(err){
        console.error(err);
      }
      }
      getUsers()
  }, [currentUser?.id, members])


  const toggelFriend = (friendId) => {
    setSelectedFriends(prev => prev.includes(friendId) 
    ? prev.filter(id=> id !== friendId) 
    : [...prev, friendId])

  }


  const addUsersToGroup = async () => {
    try{
      const res = await fetch(`/api/groups/${groupId}/add-members`,{
        method:"POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members:selectedFriends,
        })
      })
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Failed to add users");
      }

      const data = await res.json()
      data.members.forEach(member => {
        socket.emit("member-added", {
          groupId,
          member,
        });
      });
      setSelectedFriends([]);
      setShowFriends(false);
    }catch(err){
      console.error(err);
    }
  }

  const leaveGroup = async () => {
  try {
    console.log("Sending:", {
      groupId,
      userId: currentUser.id,
    });

    const res = await fetch(`/api/groups/${groupId}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    console.log("Left group:", data);
    
    router.refresh();
    router.push("/dashboard");
    


  } catch (err) {
    console.error("Leave group failed:", err.message);
  }
};

  // useEffect(() => {
  //   if (!groupId) return;
  
  //   socket.emit("join-group", groupId);
  
  //   return () => {
  //     socket.off("member-added");
  //   };
  // }, [groupId]);

  // useEffect(() => {
  //   const handleMemberAdded = (member) => {
  //     setMembers(prev => {
  //       // Don't add duplicates
  //       if (prev.some(m => m.id === member.id)) {
  //         return prev;
  //       }
  
  //       return [...prev, member];
  //     });
  //   };
  
  //   socket.on("member-added", handleMemberAdded);
  
  //   return () => {
  //     socket.off("member-added", handleMemberAdded);
  //   };
  // }, []);
  

  if (loading) return <p>Loading group...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.asideContainer}>
        <div className={styles.members}>
          <h3 className={styles.groupName}>{group?.group_name || "Group"}</h3>
          {members.map(m => (
            <div key={m.id} className={styles.groupMembersContainer} >
                <div className={styles.profileImage}>
                {m.avatar_public_id ? (
                    <img
                        src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${m.avatar_public_id}`}
                        alt="avatar"
                        className={styles.profileImage}
                    />
                    ) : (
                    <span>{m.username?.charAt(0)?.toUpperCase() || "?"}</span>
                )}
                </div>
              {m.username}
              </div>
          ))}
      </div>
      <div className={styles.actionContainer}>
          <button className={styles.settingsBtn} onClick={()=> setOpen(true)}><Image src={SettingIcon} alt="setting-Icon" className={styles.settingIconImg} /></button>
          {open && (
            <div className={styles.settingsContainer} ref={openRef}>
              <button className={styles.settingBtns} onClick={()=>setShowFriends(prev => !prev)} >Add User</button>
              <button className={styles.settingBtns} onClick={leaveGroup} >Leave group</button>
            </div>
          )}
         {showFriends && (
            <div className={styles.showFriendsContainer}>
              <div className={styles.ulList}>   
                {friends.map(friend => (
                  <div key={friend.friend_id} className={styles.friendList}>
                    <div className={styles.avatar}>
                      {friend.avatar_public_id ? (
                        <img
                          src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${friend.avatar_public_id}`}
                          alt="avatar"
                          style={{width:42}}
                        />
                      ) : (
                        <div className={styles.fallbackAvatar}>
                          {friend.friend_username?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  
                    <div className={styles.userNameContainer}>{friend.friend_username}</div>
                    <button className={selectedFriends.includes(friend.friend_id) ? styles.selectedBtn : styles.addToGroupBtn} 
                      onClick={()=> toggelFriend(friend.friend_id)} >
                      {selectedFriends.includes(friend.friend_id) ? "Selected" : "Select"}
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <button className={styles.actionBtn} onClick={addUsersToGroup}>Add Users</button>
                <button className={styles.actionBtn} onClick={()=> setShowFriends(prev => !prev) }>Cancel</button>
              </div>
            </div>  
          )}
        </div>

      </aside>
      
      <main className={styles.chat}>
        <div className={styles.messagesContainer}>
          {messages.map(m => (
            <div className={styles.messages} key={m.id}>
              <div className={styles.userInfoContainer}>
                <div className={styles.profileImage}>
                  {m.avatar_public_id ? (
                    <img
                        src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_48,h_48,c_fill/${m.avatar_public_id}.png`}
                        alt="avatar"
                        className={styles.profileImage}
                    />
                    ) : (
                    <span>{m.username?.charAt(0)?.toUpperCase() || "?"}</span>
                 )}

                </div>
                <b>{m.username}</b>
                <div className={styles.date}>{formatDate(m.created_at)}</div>

              </div>
              <div className={styles.messageContainer}>
                <span className={styles.message}>{m.message}</span>
              </div>
              
            </div>
          ))}
        </div>

        <div className={styles.inputsContainer}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type message..."
            className={styles.inputBar}
          />
          <button className={styles.button} onClick={sendMessage}> <Image className={styles.SendIcon} alt="sendIcon" src={SendIcon}/></button>
        </div>
      </main>
    </div>
  );
}
