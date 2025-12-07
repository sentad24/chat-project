import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, context) {
  try {
    const {conversationId} = await context.params
    console.log("DEBUG: conversationId =", conversationId);

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID missing" },
        { status: 400 }
      );
    }

    const queryText = `
      SELECT m.id, m.content, m.sender_id, m.created_at, u.username
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1::int
      ORDER BY m.created_at ASC
    `;

    const result = await pool.query(queryText, [conversationId]);
    console.log("DEBUG: DB returned", result.rows.length, "rows");

    return NextResponse.json({ messages: result.rows ?? [] });
  } catch (err) {
    console.error("Database error:", err.message, err.stack);
    return NextResponse.json(
      { error: "Server error fetching messages" },
      { status: 500 }
    );
  }
}
