import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { conversationId, senderId, content } = await req.json();

  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, senderId, content]
  );

  return NextResponse.json(result.rows[0]);
}

