import pool from "@/lib/db";
import { NextResponse } from "next/server";
import jwt, { decode } from "jsonwebtoken";

export async function GET() {
  try {
    const res = await pool.query(`
      SELECT posts.id, posts.title, posts.body, posts.created_at, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at ASC
    `);
    
    return NextResponse.json(res.rows);
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not fetch posts" }, { status: 500 });
  } 
}

export async function POST(req) {
  const token = req.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }    

  const user_id = decoded.id;
  const { title, body } = await req.json();

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, title, body) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user_id, title, body]
    );

    const post = result.rows[0]

    const userRes = await pool.query(
      `SELECT username FROM users WHERE id = $1`,
    [user_id]
    );
    
    post.username = userRes.rows[0].username;

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  
}


