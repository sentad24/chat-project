import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import ChatDisplay from "../components/ChatDisplay";

export default async function ChatPage({ params, }) {

  const conversationId = params?.directID;
 
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

  if (!conversationId) {
    return <div>Select a conversation</div>;
  }

  return (
    <ChatDisplay currentUser={currentUser} conversationId={conversationId} />
  );
}
