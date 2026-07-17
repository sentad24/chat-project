import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth"; // your auth function

export async function GET(req) {
  try {
    const user = getCurrentUser(req);
    console.log(user);
    

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.group_name,
        g.created_at
      FROM groups g
      JOIN group_members gm 
        ON gm.group_id = g.id
      WHERE gm.user_id = $1
        AND gm.left_at IS NULL
      ORDER BY g.created_at DESC
      `,
      [user.id]
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("GET GROUPS ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}