import pool from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    try{
        const res = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
        return NextResponse.json(res.rows)
    }catch(err){
        return NextResponse.json({error: "Could not fetch data"},{status:200})
    }
    
}

export async function POST() {
    try{
        const{user_id, title, body} = await req.json();

        if(!user_id || !title){
            return NextResponse.json({error: "user_id and title are required" },{ status: 400 })
        }

        const result = await query("INSERT INTO posts (user_id, title, body) VALUES ($1, $2, $3) RETURNING *",
            [user_id, title, body]
        );
        return NextResponse.json(result.rows[0], {status:201})

    }catch (err) {
        console.error(err);
        return NextResponse.json(
          { error: "Failed to create thread" },
          { status: 500 }
        );
      }
}