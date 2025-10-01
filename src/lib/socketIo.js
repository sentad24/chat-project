import {createServer} from "http"
import {Server} from  "socket.io"

const httpSever = createServer()
const io = new Server(httpSever,{
    cors:{
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)
    
    socket.on("message", (msg) => {
        console.log("Message resived", msg)
        io.emit("message", msg)
    });
    socket.on("disconnect", ()=>{
        console.log("User disconnctes", socket.id)
    });
});

httpSever.listen(3000,() => {
    console.log("Socket.IO server running on port 3000")
})