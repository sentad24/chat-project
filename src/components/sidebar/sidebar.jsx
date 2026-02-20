"use client"
import Image from "next/image"
import Link from "next/link"
import style from "./sidebar.module.css"
import WorldIcon from "@/../public/icons/world.png"
import UserIcon from "@/../public/icons/user.png"
import { useState, useEffect } from "react"

export default  function Sidebar({currentUser}){
   
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [groupsError, setGroupsError] = useState(null);
    
    useEffect(() => {
        async function loadFriends() {
            setGroupsLoading(true);
            setGroupsError(null);
            
            if (!currentUser?.id) return;
        
            try {
                const res = await fetch(`/api/friends/list?userId=${currentUser.id}`,{credentials:"include"});
                if (!res.ok) {
                console.error("Failed to fetch friends:", res.status, await res.text());
                return;
                }
                const data = await res.json();
                setFriends(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching friends:", err);
                setGroupsError("Failed to load groups");
            }finally {
                setGroupsLoading(false);
            }
        }
    
        loadFriends();
    }, [currentUser?.id]);

    useEffect(() => {
        console.log("Current user in Sidebar:", currentUser);
        
    }, [currentUser]);

    useEffect(()=>{
        if(!currentUser?.id) return

        async function loadGroups() {
            if(!currentUser?.id) return;
          
            try {
              const res = await fetch(`/api/groups?userId=${currentUser.id}`);
              if(!res.ok) {
                console.error("Failed to fetch groups:", res.status);
                return;
              }
              const data = await res.json();
              console.log("Groups fetched:", data);
              setGroups(Array.isArray(data) ? data : []);
            } catch(err) {
              console.error("Error fetching groups:", err);
            }
          }
          
        loadGroups()
    },[currentUser?.id])

   
    
    return(
        <div className={style.container}>
            <div className={style.globalAndSingelChats}>
                <button className={style.chat}><Link href="/dashboard"> <Image className={style.icons} alt="worldIcon" src={WorldIcon}/></Link></button>
                <button className={style.chat}><Link href="/conversation/home"> <Image className={style.icons} alt="userIcon" src={UserIcon}/></Link></button>
            </div>

            <div className={style.groupChatsContainer}>
            {groupsLoading && <p className={style.loading}></p>}

                {!groupsLoading && groupsError && (
                    <p className={style.error}>{groupsError}</p>
                )}

                {!groupsLoading && !groupsError && groups.map((group) => (
                    <Link
                        key={group.id}
                        href={`/group/${group.id}`}
                        className={style.groupChat}
                        title={group.group_name}
                    >
                        <div className={style.groupAvatar}>
                            {group.group_img ? (<img src={group.group_img} alt={group.group_name} />
                            ) : (<span>{group.group_name.charAt(0).toUpperCase()}</span>)}
                        </div>

                        
                        <span className={style.groupName}>{group.group_name}</span>
                    </Link>
                    
                ))}

                {!groupsLoading && !groupsError && groups.length === 0 && (
                <p className={style.empty}>No groups</p>
                )}
            </div>
        </div>
    )
}