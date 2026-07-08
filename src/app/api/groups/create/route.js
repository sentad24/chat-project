import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const { name, members, createdBy } = body;

    if (!name || !createdBy) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          received: body,
        },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Create the group
    const groupResult = await client.query(
      `
      INSERT INTO groups (group_name, created_by)
      VALUES ($1, $2)
      RETURNING id
      `,
      [name, createdBy]
    );

    const groupId = groupResult.rows[0].id;

    // Remove duplicate members
    const allMembers = [
      createdBy,
      ...new Set(
        (members || []).filter(id => id !== createdBy)
      )
    ];


    const values = allMembers
      .map((_, index) => `($1, $${index + 2})`)
      .join(",");

    await client.query(
      `
      INSERT INTO group_members (group_id, user_id)
      VALUES ${values}
      `,
      [groupId, ...allMembers]
    );

    await client.query("COMMIT");

    console.log("Group created successfully:", groupId);

    return NextResponse.json(
      {
        success: true,
        groupId,
      },
      { status: 200 }
    );
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Create group error:", err);

    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}