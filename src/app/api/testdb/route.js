import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    return NextResponse.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
