const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];
const adddUser = (userId, socketId) => {
    !users.some(user=> user.userId === userId) ?
    users.push({userId,socketId}) : ""
}

const removeUser = (socketId) => {
    users = users.filter(user=> user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user)=> user.userId === userId)
}

io.on("connection", (socket)=> {
    console.log("connected");
    // take userId and socketId from user
    socket.on("addUser", userId=> {
        adddUser(userId, socket.id); 
        // get all chat connected users
        io.emit("getUsers", users)
    })
})

io.on("sendMessage", ({senderID,receiverID,text})=> {
    const user = getUser(receiverID)
    io.to(user.socketId).emit("getMessage", {
        senderID,
        text,
    })
})

io.on("disconnect", ()=> {
    console.log("disconnected");gg
    removeUser(socket.id);
    io.emit("getUsers", users)
})