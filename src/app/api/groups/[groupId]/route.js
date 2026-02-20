import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { groupId } = await params;
    if (!groupId) return NextResponse.json({ error: "Missing groupId" }, { status: 400 });

    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) return NextResponse.json({ error: "Invalid groupId" }, { status: 400 });

    // Fetch group info
    const groupRes = await pool.query(
      "SELECT id, group_name, created_by, created_at FROM groups WHERE id = $1",
      [groupIdInt]
    );

    if (groupRes.rows.length === 0) return NextResponse.json({ error: "Group not found" }, { status: 404 });

    // Fetch members
    const membersRes = await pool.query(
      `
      SELECT u.id, u.username , u.avatar_public_id
      FROM group_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.group_id = $1
      `,
      [groupIdInt]
    );

    return NextResponse.json({
      group: groupRes.rows[0],
      members: membersRes.rows || [],
    });
  } catch (err) {
    console.error("Server error in GET /api/groups/[groupId]:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
