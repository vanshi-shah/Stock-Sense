const { Server } = require("socket.io");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("client connected:", socket.id);
    socket.on("disconnect", () => console.log("client disconnected:", socket.id));
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIO };
