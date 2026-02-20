import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { groupId } =  params;
    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) return NextResponse.json({ error: "Invalid groupId" }, { status: 400 });

    const res = await pool.query(
      `
      SELECT gm.id, gm.message, gm.created_at, u.username, u.avatar_public_id
      FROM group_messages gm
      JOIN users u ON u.id = gm.sender_id
      WHERE gm.group_id = $1
      ORDER BY gm.created_at ASC
      `,
      [groupIdInt]
    );
    console.log("params", params);
    return NextResponse.json(res.rows || []);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { groupId } = params;
    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) return NextResponse.json({ error: "Invalid groupId" }, { status: 400 });

    const { senderId, message } = await req.json();
    if (!senderId || !message) return NextResponse.json({ error: "senderId and message required" }, { status: 400 });

    const insertRes = await pool.query(
      `
      INSERT INTO group_messages (group_id, sender_id, message)
      VALUES ($1, $2, $3)
      RETURNING id, message, created_at
      `,
      [groupIdInt, senderId, message]
    );

    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [senderId]);
    const username = userRes.rows[0]?.username || "Unknown";

    const newMessage = {
      id: insertRes.rows[0].id,
      content: insertRes.rows[0].message,
      created_at: insertRes.rows[0].created_at,
      username,
    };

    return NextResponse.json(newMessage);
  } catch (err) {
    console.error("Failed to post message:", err);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
