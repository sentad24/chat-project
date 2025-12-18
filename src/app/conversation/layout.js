import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Sidebar from "@/components/sidebar/sidebar";
import style from "./conversation.module.css";
import Navstyle from "@/components/Navbar/navbar.module.css";
import Navbar from "@/components/Navbar/navbar";
import DirectIdClient from "./components/DirectIdClient";

export default async function ConversationLayout({ children }) {
  async function getUserFromToken(token) {
    return jwt.decode(token);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const currentUser = token ? await getUserFromToken(token) : null;

  return (
    <div className={style.container}>
      <nav>
        <div className={Navstyle.container}>
          <div className={Navstyle.nav}>
            <div className={Navstyle.logo}>Restdi</div>
            <div className={Navstyle.userInfo}>
              <h5>{currentUser?.username}</h5>
            </div>
          </div>
        </div>
      </nav>

      <div className={style.sideAndChatSection}>
        <aside>
          <Sidebar currentUser={currentUser}  />
        </aside>

        <main className={style.mainPanel}>
          <DirectIdClient currentUser={currentUser} />
          <div className={style.childContainer}> 
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}
