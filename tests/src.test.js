var expect = require('expect.js');
var Spachcock = require("../");

var cache = [];

var app = new Spachcock();
app.response = function (data) {
  cache.push(JSON.parse(data));
};

describe('src', function () {
  it('route', function (done) {
    app.route("/foo/bar", function (req, res) {
      res.json({"for": "test"});
    });

    app.handle({namespace: "foo", action: "bar"});

    expect(cache.pop()).to.eql({"for": "test"});
    done();
  });

  it('params', function (done) {
    app.route("/foo/:p", function (req, res) {
      res.json(req.params);
    });

    app.handle({namespace: "foo", action: "get-lucky"});

    expect(cache.pop()).to.eql({p: "get-lucky"});
    done();
  });

  it('query', function (done) {
    app.route("/for/query", function (req, res) {
      res.json(req.query);
    });

    app.handle({namespace: "for", action: "query?x=a&y=b"});

    expect(cache.pop()).to.eql({x: "a", y: "b"});
    done();
  });

  it('globals', function (done) {
    app.use(function (req, res, next) {
      cache.push({"iam": "global"});
      next();
    });

    app.route("/global/test", function (req, res) {
      res.json({"after": "global"});
    });

    app.handle({namespace: "global", action: "test"});

    expect(cache.pop()).to.eql({"after": "global"});
    expect(cache.pop()).to.eql({"iam": "global"});
    done();
  });

  it('middleware', function (done) {
    var test = function (req, res, next) {
      cache.push({"iam": "middleware"});
      next();
    };

    app.route("/middleware/test", test, function (req, res) {
      res.json({"after": "middleware"});
    });

    app.handle({namespace: "middleware", action: "test"});

    expect(cache.pop()).to.eql({"after": "middleware"});
    expect(cache.pop()).to.eql({"iam": "middleware"});
    expect(cache.pop()).to.eql({"iam": "global"});
    done();
  });

  it('redirect', function (done) {
    app.route("/oh-cmon", function (req, res) {
      res.json({"in": "the-end"});
    });

    app.route("/redirect/here", function (req, res) {
      res.redirect("/oh-cmon");
    });

    app.handle({namespace: "redirect", action: "here"});

    expect(cache.pop()).to.eql({"in": "the-end"});
    expect(cache.pop()).to.eql({"iam": "global"});
    expect(cache.pop()).to.eql({"iam": "global"});
    done();
  });

  it('custom parser', function (done) {
    var oldParser = app.parser;

    app.parser = function (data) {
      return "/" + data.a + "/" + data.b + "/" + data.c;
    };

    app.route("/a/b/c", function (req, res) {
      res.json({"after": "global"});
    });

    app.handle({a: "a", b: "b", c: "c"});

    app.parser = oldParser;

    expect(cache.pop()).to.eql({"after": "global"});
    expect(cache.pop()).to.eql({"iam": "global"});
    done();
  });

  it('socket handle', function (done) {
    var stack = [];

    var socket = {
      send: function (data) {
        stack.push(JSON.parse(data));
      }
    };

    app.route("/socket/here", function (req, res) {
      res.json({a: "1", b: "2"});
    });

    app.handle({"namespace": "socket", "action": "here"}, null, socket);

    expect(stack.pop()).to.eql({a: "1", b: "2"});
    expect(cache.pop()).to.eql({"iam": "global"});
    done();
  });

  it('locals', function (done) {
    app.locals.test = "test";
    expect(app.locals).to.eql({test: "test"});
    done();
  });

  it('settings', function (done) {
    app.set("say-hi", "hello");
    expect(app.get("say-hi")).to.be("hello");
    done();
  });

  it('enable/disable', function (done) {
    app.enable("test-e");
    app.disable("test-d");
    expect(app.get("test-e")).to.be(true);
    expect(app.get("test-d")).to.be(false);
    done();
  });

  it('enabled/disabled', function (done) {
    expect(app.enabled("test-e")).to.be(true);
    expect(app.disabled("test-d")).to.be(true);
    expect(app.disabled("test-e")).to.be(false);
    expect(app.enabled("test-d")).to.be(false);
    done();
  });

  it('final', function (done) {
    expect(cache.length).to.be(0);
    done();
  });
});