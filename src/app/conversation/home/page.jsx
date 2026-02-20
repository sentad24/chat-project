import DirectIdClient from "../components/DirectIdClient";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import ChatPage from "../[directID]/page";

export default async function ConversationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || null;

  if (!token) return <p>You must log in</p>;

  let currentUser = null;
  try {
    currentUser = jwt.verify(token, process.env.JWT_SECRET); // decode JWT
  } catch (err) {
    return <p>Invalid session</p>;
  }
  let groups = [];
  try {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const res = await fetch(`${protocol}://${host}/api/groups?userId=${currentUser.id}`);
    if (res.ok) {
      groups = await res.json();
    }
  } catch (err) {
    console.error("Error fetching groups:", err);
  }

  return <ChatPage currentUser={currentUser} groups={groups} />;
}
