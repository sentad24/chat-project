"use cilent"
import style from "./globalChat.module.css"
import Image from "next/image"
import SendIcon from "@/../public/icons/send-message.png"
import GlobalChat from "./globalChat/page"

export default function ChatHomePage(){
    return(
        <div className={style.container}>
            <div className={style.chatContainer}>
                <div className={style.messageDisplay}>
                    <GlobalChat/>
                </div>
                <div className={style.actionContainer} >
                    <input className={style.placeholder} placeholder="text"/>
                    <button className={style.button}><Image src={SendIcon} className={style.sendIcon} alt="sendIcon" /></button>
                </div>
                
            </div>
        </div>
    )
}