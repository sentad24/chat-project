import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import jwt from "jsonwebtoken";
import ChatLayout from "@/app/chat/layout"
import style from "@/components/Navbar/navbar.module.css"

export default async function DashboardPage() {
  // Get cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/signin");
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return <p>Invalid or expired session. Please log in again.</p>;
  }

  return (
    <div>
        <nav> 
            <div className={style.container}>
              <div className={style.nav}>
                  <div className={style.logo}>
                      Restdi
                  </div>
                  <div className={style.userInfo}>
                      <h5>{user.username}</h5>
                  </div>
              </div>
           </div>
        </nav>
        <ChatLayout/>
    </div>
  );
}
