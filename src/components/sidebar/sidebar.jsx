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
            const res = await fetch(`/api/friends/list?userId=${currentUser.id}`);
            if (!res.ok) {
              console.error("Failed to fetch friends:", res.status, await res.text());
              return;
            }
            const data = await res.json();
            setFriends(Array.isArray(data) ? data : []);
            console.log(data)
          } catch (err) {
            console.error("Error fetching friends:", err);
          }
        }
    
        loadFriends();
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
           <div className={style.add}>

                <button className={style.addBtn} onClick={()=>{ setActive(true)}}>
                    <h1>+</h1>
                </button>
                <div>
                    {active === true && (
                        <div className={style.createFromContainer}>
                            
                            <form action="">
                                <label>Create groupChat</label>
                                <input  
                                    type="text"
                                    placeholder="Enter a name..."
                                        
                                />
                                <h3>Add friends</h3>

                                <div className={style.friendsList}>
                                    {friends.map((f) => (
                                        <div key={f.id} className={style.friendItem}>
                                        <label>
                                            <input type="checkbox" value={f.friend_id} />
                                            {f.friend_username}
                                        </label>
                                        </div>
                                    ))}
                                </div>

                               
                                <div className={style.actions}>
                                    <button type="button" className={style.cancelBtn} onClick={() => setActive(false)}> Cancel</button>
                                    <button type="submit" className={style.createBtn}> Create</button>
                                </div>
                            </form>
                            

                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}