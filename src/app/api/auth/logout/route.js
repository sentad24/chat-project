import { NextResponse } from "next/server";

export async function POst() {
    const res = NextResponse.json({ success:true })

    res.cookies.set("authToken", "",{
        httpOnly:true,
        expires: new Date(0),
        path:"/",
    })

    return res
}