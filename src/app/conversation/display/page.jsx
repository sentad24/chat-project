import style from "./dispaly.module.css"
import SendIcon from "@/../public/icons/send-message.png"
import Image from "next/image"


export default function ChatDisplay() {
    return(
        <div>
            <main className={style.mainContainer}>
                <div className={style.chatDisplay}>
                    Display singel chat
                </div>
                <div className={style.actionContainer}>
                    <input className={style.inputText}  type="text"placeholder="Message" />
                    <button className={style.button}> <Image src={SendIcon} className={style.sendIcon} alt="sendIcon" /> </button>
                </div>
            </main>
        </div>
    )
}