const express = require("express");
const cors = require("cors");
require("./utils/database");
const Post=require('./modals/postModal')
const User=require('./modals/userModal')
const socket=require('socket.io')
const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

app.use("/api", userRouter);
app.use("/api/admin", adminRouter);

let port = 9000;
const server=app.listen(port, () => {
  console.log("server started at", port);
});
const io=socket(server,{
  cors:{
    origin:'http://localhost:3000',
    Credentials:true,
  }
})
global.onlineUsers=new Map()
io.on('connection',(socket)=>
{
  global.chatSocket=socket
  socket.on('add-user',(userId)=>
  {
    onlineUsers.set(userId,socket.id)
  })
  socket.on("send-msg", (data) => {
    
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
})
