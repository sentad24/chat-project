import {createServer} from "http"
import { Server } from "socket.io"
import pool from "@/lib/db"

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: { 
        origin: "http://localhost:3000", 
        methods: ["GET" , "POST"],
    },
   
});

io.on("connection", (socket) => {
    console.log("User connectde:", socket.id);

    socket.on("message", async (msg) => {
        console.log("Recived:", msg)
        // save to db
        try{
            const result = await pool.query(
                `INSERT INTO posts (user_id, title, body)
                VALUES ($1, $2, $3) RETURNING id, user_id, title, body, created_at`,
                [msg.user_id, msg.title, msg.body]
            );
            const post = result.rows[0];

            const userRes = await pool.query(
                `SELECT username FROM users WHERE id = $1`,
                [post.user_id]
            );
            post.username = userRes.rows[0].username
            
            io.emit("message", post);
        }catch(err){
            console.error("DB error", err)
        }
    })
    socket.io("disconnect", () => {
        console.log("User disconnected:", socket.id)
    });
});

httpServer.listen(4000, () => {
    console.log("Socket.IO server running on port 4000")
})
