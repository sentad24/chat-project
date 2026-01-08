"use client";

import style from "../group.module.css";
import DirectIdClient from "@/app/conversation/components/DirectIdClient";

export default function GroupHomePage({ currentUser }) {
  return (
    <div className={style.groupHome}>
      <h1>Your Groups</h1>
      {/* List of groups goes here */}

      {/* Create group tab inside your DirectIdClient component */}
      <DirectIdClient currentUser={currentUser} />
    </div>
  );
}
