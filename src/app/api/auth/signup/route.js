import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { getRandomAvatar } from "@/lib/getAvatarPublicIds";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, username, password, avatarPublicId } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const avatar_public_id = avatarPublicId || (await getRandomAvatar());

    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, avatar_public_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, avatar_public_id`,
      [email, username, hashed, avatar_public_id]
    );

    const user = result.rows[0];

    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
    const cookie = serialize("authToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ user }, { headers: { "Set-Cookie": cookie } });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Email or username already exists" }, { status: 400 });
  }
}
