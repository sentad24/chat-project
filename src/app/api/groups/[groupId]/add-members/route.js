import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    console.log("HIT add-members API");

    const groupId = params.groupId;
    console.log("groupId:", groupId);

    const body = await req.json();
    console.log("body:", body);

    const { members } = body;

    if (!members || !members.length) {
      return NextResponse.json(
        { error: "No members provided" },
        { status: 400 }
      );
    }

    const values = members
      .map((id, i) => `($1, $${i + 2})`)
      .join(",");

    await pool.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ${values}`,
      [groupId, ...members]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Backend crash:", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}