var express = require("express");
var app = express();
var server = require("http").createServer(app);
const io = require("socket.io")(server);
const fs = require("fs");
server.listen(process.env.PORT || 3000);
io.sockets.on("connection", (socket) => {
  console.log("A person connect");
});
