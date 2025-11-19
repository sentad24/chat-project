import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try{
       const res = await pool.query(` SELECT username FROM users`) 
       return NextResponse.json(res.rows)

    } catch(err){
        console.error(err)
        return NextResponse.json({error: "Could not finde Users"}, {status:500})
    }
}