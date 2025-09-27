import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username",
      [email, username, hashed]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (err) {
    console.error("Signup error:", err.message);
    return NextResponse.json({ error: "Email or username already exists" }, { status: 400 });
  }
}
