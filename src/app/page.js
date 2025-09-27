import Image from "next/image";
import Sidebar from "@/components/sidebar/sidebar";
import LoginFrom from "./login/page";
import SignIn from "./signup/page";

export default function Home() {
  return (
    <div className="container">
      <LoginFrom/>
      {/* <SignIn/> */}
    </div>
    
 
  );
}
