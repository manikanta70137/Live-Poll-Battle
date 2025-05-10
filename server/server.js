const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("createRoom", ({ name }) => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", ({ name, roomId }) => {
    socket.join(roomId);
    socket.emit("joinedRoom");
  });

  // You can add voting logic here later
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
