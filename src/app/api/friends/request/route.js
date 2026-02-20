import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT f.sender_id, u.username, u.avatar_public_id
       FROM friendships f
       JOIN users u ON f.sender_id = u.id
       WHERE f.receiver_id = $1 AND f.status = 'pending'`,
      [userId]
    );

    return NextResponse.json(result.rows || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function POST(req) {
  const { senderId, receiverId } = await req.json();

  try {
    const result = await pool.query(
      `INSERT INTO friendships (sender_id, receiver_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [senderId, receiverId, "pending"]
    );

    return NextResponse.json({ message: "Friend request sent", friendship: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
  }
}
