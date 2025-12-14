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
      SELECT 
          f.id,
          f.status,
          CASE 
              WHEN f.sender_id = $1 THEN f.receiver_id
              ELSE f.sender_id
          END AS friend_id,
          CASE 
              WHEN f.sender_id = $1 THEN u2.username
              ELSE u1.username
          END AS friend_username
      FROM friendships f
      JOIN users u1 ON f.sender_id = u1.id
      JOIN users u2 ON f.receiver_id = u2.id
      WHERE f.status = 'accepted'
        AND (f.sender_id = $1 OR f.receiver_id = $1)
      `,
      [userId]
    );

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
