var net = require('net');
var Spachcock = require("./../index");
var $ = new Spachcock();

$.route("/foo/bar", function (req, res) {
  res.send({
    "hi": "ws"
  });
});

$.listen(function () {
  net.createServer(function (socket) {
    socket.on("data", function (message) {
      $.handle(message, null, socket);
    });
  }).listen(8080);
});



