import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    console.log("HIT leave-group API");

    const groupId = params.groupId;

    const body = await req.json();
    const { userId } = body;

    console.log("groupId received:", groupId);
    console.log("userId received:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE group_members
      SET left_at = NOW()
      WHERE group_id = $1
      AND user_id = $2
      AND left_at IS NULL
      `,
      [groupId, userId]
    );

    console.log("Rows updated:", result.rowCount);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "User is not in this group" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Left group"
    });

  } catch (err) {
    console.error("Leave group error:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}