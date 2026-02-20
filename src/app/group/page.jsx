"use client";

import { useEffect, useState } from "react";
import style from "./group.module.css";

export default function GroupHomePage({ currentUser }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    async function loadGroups() {
      try {
        const res = await fetch(`/api/groups?userId=${currentUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch groups");

        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadGroups();
  }, [currentUser]);

  return (
    <div className={style.groupHome}>
      <h1>Your Groups</h1>

      {groups.length === 0 && <p>No groups yet</p>}

      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <a href={`/group/${group.id}`}>
              {group.group_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

