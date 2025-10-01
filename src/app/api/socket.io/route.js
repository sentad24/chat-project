import {createSever} from "http"
import { Server } from "socket.io"
import pool from "@/lib/db"

const httpSever = createSever()

const io = new Server(httpSever, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("User connectde:", socket.id);

    socket.on("message", async (msg) => {
        console.log("Recived:", msg)
        // save to db
        try{
            const result = await pool.query(
                `INSTER INTO posts (user_id, title, body)
                VALUES ($1, $2, $3) RETURNING id, user_id, title, body, created_at`,
                [msg.user_id, msg.title, msg.body]
            );
            const post = result.rows[0];

            const userRes = await pool.query(
                `SELECT username FROM users WHERE id = $1`,
                [post.user_id]
            );
            post.username = userRes.rows[0].username
            
            io.emit("message", result.rows[0]);
        }catch(err){
            console.error("DB error", err)
        }
    })
    socket.io("disconnect", () => {
        console.log("User disconnected:", socket.id)
    });
});

httpSever.listen(3000, () => {
    console.log("Socket.IO server running on port 3000")
})
