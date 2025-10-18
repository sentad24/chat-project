import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
 


export async function DELETE(req, { params }) {
    const resolvedParams = await Promise.resolve(params); 
    const id = resolvedParams?.id;


  try {
    // Read token from HttpOnly cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const userId = decoded.id;

    // Check ownership
    const { rows } = await pool.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    if (rows[0].user_id !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete comment
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
