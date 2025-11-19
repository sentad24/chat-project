import Style from "./conversation.module.css"
import DirectId from "@/app/conversation/[directID]/page"
import ChatDisplay from "./display/page"

export default function ConversationPage() {
   
    return (
        <div className={Style.conversationSection}>
            <div>
                <DirectId/>
            </div>
            <div className={Style.chatSection}>
                <ChatDisplay/>
            </div>
            
            
        </div>
    )
}