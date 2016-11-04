var io = require('socket.io')(8080);
var Spachcock = require("./../index");
var $ = new Spachcock();

$.route("/foo/bar", function (req, res) {
  res.emit("test", {
    "hi": "ws"
  });
});

$.listen(function () {
  io.on("connection", function (socket) {
    socket.on("test", function (data) {
      $.handle(data, null, socket);
    });
  });
});