import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // your Next.js frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("deleteMessage", async ({id}) =>{
    console.log("message deleted", id)
    io.emit("deleteMessage", ({id}))
  })


});

// Run the HTTP + Socket.IO server
httpServer.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
