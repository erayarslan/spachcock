var Spachcock = require("./../index");
var $ = new Spachcock();

var secure = function (req, res, next) {
  var body = req.body.data;
  if (body.username === "test" &&
    body.password === "secret") {
    console.log("[spachcock] login done(:");
    next();
  } else {
    res.json({
      err: true,
      msg: "login failed"
    })
  }
};

$.route("/hello/:p", function (req, res) {
  console.log(req.body);
  res.json({err: false, data: req.params});
});

$.route("/foo/bar", secure, function (req, res) {
  res.json({err: false, data: {"requestUrl": req.url}}).redirect("/hello/3");
}).model({
  required: true,
  type: 'object',
  properties: {
    data: {
      required: true,
      type: 'object',
      properties: {
        username: {
          required: true,
          type: "string"
        }
      }
    }
  }
});

$.response = console.log;

$.listen(function () {
  console.log("[spachcock] running!");
});

$.handle({
  namespace: "foo",
  action: "bar",
  data: {username: "test", password: "secret"}
});