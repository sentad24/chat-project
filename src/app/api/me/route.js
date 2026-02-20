import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id

    const result = await pool.query(
      "SELECT id, username, avatar_public_id FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
