"use client"
import Image from "next/image"
import style from "./sidebar.module.css"
import WorldIcon from "@/../public/icons/world.png"
import UserIcon from "@/../public/icons/user.png"
import { useState } from "react"

export default function Sidebar(){
    const[active,setActive] = useState(false)
   
    return(
        <div className={style.container}>
            <div className={style.globalAndSingelChats}>
                <button className={style.chat}><a href="/dashboard"> <Image className={style.icons} alt="worldIcon" src={WorldIcon}/></a></button>
                <button className={style.chat}><a href="/conversation/home"> <Image className={style.icons} alt="userIcon" src={UserIcon}/></a></button>
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
                            <div className={style.closeContainer}>
                                <button className={style.closeBtn} onClick={()=>{setActive(false)}}>X</button>
                            </div>
                            <h1>Create groupChat</h1>

                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}