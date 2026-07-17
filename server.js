const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");


const dev = process.env.NODE_ENV !== "production";

const app = next({
    dev
});


const handler = app.getRequestHandler();



app.prepare().then(()=>{


    const httpServer = createServer(
        handler
    );


    const io = new Server(
        httpServer,
        {
            cors:{
                origin:"http://localhost:3000"
            }
        }
    );



    const onlineUsers = new Map();



    io.on(
        "connection",
        (socket)=>{


            const userId =
                socket.handshake.auth.userId;



            if(!userId){
                socket.disconnect();
                return;
            }



            socket.join(
                `user-${userId}`
            );



            onlineUsers.set(
                userId,
                socket.id
            );



            console.log(
                "Connected:",
                userId
            );



            socket.on(
                "send-private-message",
                (data)=>{


                    io.to(
                        `conversation-${data.conversationId}`
                    )
                    .emit(
                        "new-private-message",
                        data
                    );


                }
            );



            socket.on(
                "join-conversation",
                (conversationId)=>{


                    socket.join(
                        `conversation-${conversationId}`
                    );


                }
            );



            socket.on(
                "send-friend-request",
                (data)=>{


                    io.to(
                        `user-${data.receiverId}`
                    )
                    .emit(
                        "friend-request-received",
                        data
                    );


                }
            );



            socket.on(
                "disconnect",
                ()=>{

                    onlineUsers.delete(userId);


                    io.emit(
                        "user-offline",
                        {
                            userId
                        }
                    );

                }
            );


        }
    );



    httpServer.listen(
        3000,
        ()=>{
            console.log(
                "Server running on http://localhost:3000"
            );
        }
    );


});