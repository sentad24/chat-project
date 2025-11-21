import Style from "./conversation.module.css";
import ChatDisplay from "./display/page";
import DirectIdClient from "./[directID]/directIdClient/page";
import { cookies } from "next/headers";
import {jwtDecode} from "jwt-decode";

export default async function ConversationPage() {
  // Await cookies() in async server component
  const cookieStore = cookies();
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
    <div className={Style.conversationSection}>
      <div>
        <DirectIdClient currentUser={currentUser} />
      </div>
      <div className={Style.chatSection}>
        <ChatDisplay />
      </div>
    </div>
  );
}
