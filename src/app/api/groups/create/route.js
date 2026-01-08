"use server";

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, members, createdBy } = body;

    if (!name || !createdBy) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert group with createdBy
      const res = await client.query(
        "INSERT INTO groups (group_name, created_by) VALUES ($1, $2) RETURNING id",
        [name, createdBy]
      );

      const groupId = res.rows[0].id;

      // Insert members if any
      if (members && members.length > 0) {
        const placeholders = members.map((_, i) => `($1, $${i + 2})`).join(",");
        await client.query(
          `INSERT INTO group_members (group_id, user_id) VALUES ${placeholders}`,
          [groupId, ...members]
        );
      }

      await client.query("COMMIT");

      return new NextResponse(JSON.stringify({ groupId }), { status: 200 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
