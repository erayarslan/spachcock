var Spachcock = require("./../../index");
var $ = new Spachcock();

var FooModel = require("./FooModel");
var FooController = require("./FooController");

$.route("/foo/bar", FooController.bar).model(FooModel);

$.response = console.log;

$.handle({
  namespace: "foo",
  action: "bar",
  data: {username: "test", password: "secret"}
});