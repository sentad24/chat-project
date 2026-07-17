import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    // Get logged-in user from JWT
    const user = getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { error: "Missing groupId" },
        { status: 400 }
      );
    }

    const groupIdInt = parseInt(groupId, 10);

    if (isNaN(groupIdInt)) {
      return NextResponse.json(
        { error: "Invalid groupId" },
        { status: 400 }
      );
    }
    console.log("JWT user:", user);
    console.log("Requested group:", groupIdInt);  


    // Check if current user belongs to this group
    const memberCheck = await pool.query(
      `
      SELECT 1
      FROM group_members
      WHERE group_id = $1
      AND user_id = $2
      AND left_at IS NULL
      `,
      [groupIdInt, user.id]
    );
    console.log("Member check result:", memberCheck.rows);


    if (memberCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }


    // Fetch group info
    const groupRes = await pool.query(
      `
      SELECT 
        id,
        group_name,
        created_by,
        created_at
      FROM groups
      WHERE id = $1
      `,
      [groupIdInt]
    );


    // Fetch members
    const membersRes = await pool.query(
      `
      SELECT 
        u.id,
        u.username,
        u.avatar_public_id
      FROM group_members gm
      JOIN users u 
      ON u.id = gm.user_id
      WHERE gm.group_id = $1
      AND gm.left_at IS NULL
      `,
      [groupIdInt]
    );


    return NextResponse.json({
      group: groupRes.rows[0],
      members: membersRes.rows || [],
    });


  } catch (err) {
    console.error(
      "Server error in GET /api/groups/[groupId]:",
      err
    );

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}