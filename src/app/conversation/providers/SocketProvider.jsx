"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";


export default function SocketProvider({ children,userId}) {

  useEffect(()=>{
    if (!userId) return;

    socket.auth = {
      userId
    };

    socket.connect();

    socket.on(
      "connect",
      ()=>{
        console.log(
          "Socket connected:",
          socket.id
        );
      }
    );


    socket.on(
      "user-online",
      (data)=>{

        console.log(
          "User online:",
          data.userId
        );

      }
    );

    socket.on(
      "user-offline",
      (data)=>{

        console.log(
          "User offline:",
          data.userId
        );

      }
    );

    return ()=>{

      socket.disconnect();

    };

  },[userId]);

  return children;
}