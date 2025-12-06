import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {

    const {user1, user2} = await req.json()
    console.log("startConversation input:", user1, user2)
    
    try{
        const existing = await pool.query(
        `SELECT * FROM conversations 
        WHERE (user1_id=$1 AND user2_id=$2)
        OR (user1_id=$2 AND user2_id=$1) `, 
        [user1,user2]
        )
        if(existing.rows.length > 0 ) {
            return NextResponse.json(existing.rows[0])
        }
        const result = await pool.query(
            `INSERT INTO conversations (user1_id, user2_id)
            VALUES ($1, $2) RETURNING *`,
            [user1, user2]
        );
        return NextResponse.json(result.rows[0])
    }catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }


}