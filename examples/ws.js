var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var Spachcock = require("./../index");
var $ = new Spachcock();

$.route("/foo/bar", function (req, res) {
  res.send({
    "hi": "ws"
  });
});

$.listen(function () {
  wss.on('connection', function (ws) {
    ws.on('message', function (message) {
      $.handle(message, null, ws);
    });
  });
});