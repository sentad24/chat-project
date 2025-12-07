import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.url.includes("userId=")
    ? new URL(req.url).searchParams.get("userId")
    : null;

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const result = await pool.query(
      `SELECT *
       FROM users u
       WHERE u.id != $1
         AND NOT EXISTS (
           SELECT 1
           FROM friendships f
           WHERE (f.sender_id = $1 AND f.receiver_id = u.id
                  OR f.receiver_id = $1 AND f.sender_id = u.id)
             AND (f.status = 'pending' OR f.status = 'accepted')
         )`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
