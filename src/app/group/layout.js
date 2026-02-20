import Sidebar from "@/components/sidebar/sidebar"
import Navbar from "@/components/Navbar/navbar";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import style from "./group.module.css"

export default async function GroupLayout({ children}) {
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
    return(
        <div>
            <nav> 
                <Navbar user={currentUser}/>
            </nav>
            <div className={style.groupLayoutContainer}>
                <aside>
                    <Sidebar currentUser={currentUser}/>
                </aside>
                {children}
            </div>
        </div>
        
    )
    
    
}