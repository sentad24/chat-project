import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await pool.query(
      `
      SELECT f.id,
             f.sender_id,
             f.receiver_id,
             f.status,
             u1.username AS sender_username,
             u2.username AS receiver_username
      FROM friendships f
      JOIN users u1 ON f.sender_id = u1.id
      JOIN users u2 ON f.receiver_id = u2.id
      WHERE f.status = 'accepted' AND (f.sender_id=$1 OR f.receiver_id=$1)
      `,
      [userId]
    );

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
