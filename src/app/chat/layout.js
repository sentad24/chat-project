import Sidebar from "@/components/sidebar/sidebar";
import style from "./globalChat.module.css"
import ChatHomePage from "./page";

export default function ChatLayout({children}) {
  return (
   <div className={style.container}>
        <aside>
            <Sidebar/>
        </aside>

        <main>
            {children}
            <ChatHomePage/>
        </main>
        
   </div>
  );
}