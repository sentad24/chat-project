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


export async function GET(req) {
    const conversationId = req.nextUrl.searchParams.get("conversationId");
  
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE conversation_id=$1
       ORDER BY created_at ASC`,
      [conversationId]
    );
  
    return NextResponse.json(result.rows);
  }