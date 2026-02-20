import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import ChatLayout from "@/app/channels/layout";
import Navbar from "@/components/Navbar/navbar";
import style from "@/components/Navbar/navbar.module.css";

export default async function DashboardPage() {
  // Get cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/signup");
  }

  let currentUser = null; 

  try {
    currentUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Current user from JWT:", currentUser);

  } catch (err) {
    return <p>Invalid or expired session. Please log in again.</p>;
  }

  return (
    <div>
     <Navbar currentUser={currentUser} />
      <ChatLayout currentUser={currentUser} />
    </div>
  );
}
