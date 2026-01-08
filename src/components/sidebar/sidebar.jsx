"use client"
import Image from "next/image"
import Link from "next/link"
import style from "./sidebar.module.css"
import WorldIcon from "@/../public/icons/world.png"
import UserIcon from "@/../public/icons/user.png"
import { useState, useEffect } from "react"

export default  function Sidebar({currentUser}){
   
    const [active,setActive] = useState(false)
    const [friends, setFriends] = useState([])
    
    useEffect(() => {
        async function loadFriends() {
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
          }
        }
    
        loadFriends();
    }, [currentUser?.id]);

    useEffect(() => {
        console.log("Current user in Sidebar:", currentUser);
        
    }, [currentUser]);

   
    
    return(
        <div className={style.container}>
            <div className={style.globalAndSingelChats}>
                <button className={style.chat}><Link href="/dashboard"> <Image className={style.icons} alt="worldIcon" src={WorldIcon}/></Link></button>
                <button className={style.chat}><Link href="/conversation/home"> <Image className={style.icons} alt="userIcon" src={UserIcon}/></Link></button>
            </div>

            <div className={style.groupChatsContainer}>
                <div className={style.groupChat}><h1>SN</h1></div>
            </div>
        </div>
    )
}