import Sidebar from "@/components/sidebar/sidebar";
import style from "./globalChat.module.css"
import ChatHomePage from "./page";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export default async function ChatLayout({children}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value

  let currentUser = null

  if(token) {
    try{
      currentUser = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
      console.error("Invalid token", err);
    }
  }
  console.log("Server user in layout:", currentUser);

  return (
   <div className={style.container}>
        <aside>
            <Sidebar currentUser={currentUser} />
        </aside>

        <main>
          {children}
          <ChatHomePage/>
        </main>
        
   </div>
  );
}