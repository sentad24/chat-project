import GroupPage from "./GroupPage";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export default async function Page({ params }) {
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
  const { group } = await params;
  return <GroupPage groupId={group} currentUser={currentUser} />;
}

