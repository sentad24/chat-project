"use client";

import { useEffect, useState } from "react";

export default function GroupPage({ groupId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch(`/api/groups/${groupId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadMessages();
  }, [groupId]);

  return (
    <div>
      <h1>Group: {groupId}</h1>
      <ul>
        {messages.map(m => (
          <li key={m.id}>{m.text}</li>
        ))}
      </ul>
    </div>
  );
}
