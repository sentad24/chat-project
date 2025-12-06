import DirectIdClient from "../components/DirectIdClient";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import ChatPage from "../[directID]/page";

export default async function ConversationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || null;

  let currentUser = null;

  if (token) {
    try {
      currentUser = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  return (
    <ChatPage currentUser={currentUser}/>
  );
}
