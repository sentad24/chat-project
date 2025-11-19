import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import Sidebar from "@/components/sidebar/sidebar"
import style from "./conversation.module.css"
import Navstyle from "@/components/Navbar/navbar.module.css"
import Navbar from "@/components/Navbar/navbar";
import ConversationPage from "./page";
import DirectId from "./[directID]/page";

export default async function ConversationLayout() {

    async function getUserFromToken(token) {
            return jwt.decode(token); // returns the payload
          }
        const cookieStore =  await cookies()
        const token = cookieStore.get("authToken")?.value
    
        const user = token ? await getUserFromToken(token) : null
    
    return (
     <div className={style.container}>
        <nav>
            <div className={Navstyle.container}>
                <div className={Navstyle.nav}>
                    <div className={Navstyle.logo}>
                        Restdi
                    </div>
                    <div className={Navstyle.userInfo}>
                        <h5>{user.username}</h5>
                    </div>
                </div>
            </div>
        </nav>
        <div className={style.sideAndChatSection}>
            <aside>
              <Sidebar/>
            </aside>
            <main>
                <ConversationPage/>
            </main>
        </div>
        
          
     </div>
    );
  }


