import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import DirectIdClient from "./directIdClient/page";

export default function DirectIdPage(){
    const token = cookies().get("authToken")?.value || null

    let currentUser = null

    if(token){
        try{
            currentUser = jwtDecode(token)
        } catch(err) {
            console.error('Invalid token:', err)
        }
    }
    return <DirectIdClient currentUser={currentUser} />
}