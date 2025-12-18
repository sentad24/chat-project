import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const res = await pool.query(
      `
      SELECT DISTINCT
        u.id,
        u.username
      FROM friendships f
      JOIN users u
        ON u.id = CASE
          WHEN f.sender_id = $1 THEN f.receiver_id
          ELSE f.sender_id
        END
      WHERE
        f.status = 'accepted'
        AND (f.sender_id = $1 OR f.receiver_id = $1)
        AND f.sender_id <> f.receiver_id
      `,
      [userId]
    );

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not fetch posts" }, { status: 500 });
  }
}
