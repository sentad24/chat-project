import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [decoded.userId]
    );

    return NextResponse.json({ user: result.rows[0] });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
