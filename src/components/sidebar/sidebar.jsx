"use client"
import Image from "next/image"
import style from "./sidebar.module.css"
import WorldIcon from "@/../public/icons/world.png"
import UserIcon from "@/../public/icons/user.png"

export default function Sidebar(){
   
    return(
        <div className={style.container}>

            <div className={style.globalAndSingelChats}>

                    <button className={style.chat}><a href="/dashboard"> <Image className={style.icons} alt="worldIcon" src={WorldIcon}/></a></button>
                    <button className={style.chat}><a href="/conversation/home"> <Image className={style.icons} alt="userIcon" src={UserIcon}/></a></button>
                </div>

            <div className={style.chanels}>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
                <div className={style.chat}><h1>SN</h1></div>
           </div>
           <div className={style.add}>
            <button className={style.addBtn}>
                <h1>+</h1>
            </button>
           
           </div>
        </div>
    )
}