import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { getAvatarPublicIds } from "@/lib/getAvatarPublicIds";
import pool from "@/lib/db";

export async function GET() {
  try {
    const avatars = await getAvatarPublicIds();
    return new Response(JSON.stringify({ avatars }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("GET /api/avatars error:", err);
    return new Response(JSON.stringify({ avatars: [] }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { avatar_public_id } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    await pool.query(
      "UPDATE users SET avatar_public_id = $1 WHERE id = $2",
      [avatar_public_id, userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/avatars error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}