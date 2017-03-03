var Request = require(__dirname + "/request");
var Response = require(__dirname + "/response");

var _u = require(__dirname + "/utils");

var _ = require("lodash");
var pathToRegexp = require('path-to-regexp');
var url = require('url');
var validator = require('is-my-json-valid');

var Spachcock = function () {
  this.settings = {};
  this.routes = {};
  this.globals = [];
  this.locals = {};
  this.models = {};
};

Spachcock.prototype.get = function (key) {
  return this.settings.hasOwnProperty(key) ? this.settings[key] : undefined;
};

Spachcock.prototype.set = function (key, value) {
  this.settings[key] = value;
};

Spachcock.prototype.enable = function (key) {
  this.settings[key] = true;
};

Spachcock.prototype.disable = function (key) {
  this.settings[key] = false;
};

Spachcock.prototype.enabled = function (key) {
  return this.settings[key] === true;
};

Spachcock.prototype.disabled = function (key) {
  return this.settings[key] === false;
};

Spachcock.prototype.use = function (f) {
  this.globals.push(f);
};

Spachcock.prototype.route = function () {
  var self = this;

  if (arguments.length > 1) {
    var keys = [];
    var args = _.values(arguments);
    var path = args.shift();
    var callbacks = this.globals.concat(args);

    this.routes[path] = {
      r: pathToRegexp(path, keys),
      k: keys,
      f: function (req, res) {
        var next = function (i) {
          return i != callbacks.length ? function () {
            callbacks[i](req, res, next(i + 1));
          } : _u.nothing
        };

        next(0)(req, res);
      }
    };

    return {
      model: function (obj) {
        self.routes[path].m = validator(obj);
      }
    }
  } else {
    return {}
  }
};

Spachcock.prototype._extract = function (route, path) {
  var m = route.r.exec(path);
  var params = {};

  for (var i = 1; i < m.length; i++) {
    var prop = route.k[i - 1].name;
    var val = _u.DecodeParam(m[i]);

    if (!!val || !(_u.hasOwnProperty.call(params, prop))) {
      params[prop] = val;
    }
  }

  return params;
};

Spachcock.prototype.catch = function (data, path, client, back) {
  var req = new Request(this);
  var res = new Response(this, client);

  path = path || this.parser(this.preParser(data));
  var r = url.parse(path, true);
  path = r.pathname;

  _.forEach(this.routes, _.bind(function (route) {
    if (route.r.test(path)) {
      var params = this._extract(route, path);

      req.url = path;
      req.params = params;
      req.body = data;
      req.query = r.query;
      req.route = route;

      res.back = back || _u.nothing;

      if (route.m) {
        if (route.m(data)) {
          route.f(req, res);
        } else {
          console.log(route.m.errors);
        }
      } else {
        route.f(req, res);
      }

      return false;
    }
  }, this));
};

Spachcock.prototype.preParser = function (data) {
  try {
    if (!_.isObject(data)) {
      return JSON.parse(data);
    } else if (Buffer.isBuffer(data)) {
      var str = data.toString();
      if (str.trim() === "") {
        return {};
      } else {
        return JSON.parse(str);
      }
    } else {
      return data;
    }
  } catch (e) {
    return {};
  }
};

Spachcock.prototype.parser = function (data) {
  return "/" + data.namespace + "/" + data.action;
};

Spachcock.prototype.handle = Spachcock.prototype.catch;

Spachcock.prototype.response = _u.nothing;

Spachcock.prototype.listen = function (callback) {
  (this.response && callback ? callback : _u.nothing)();
};

module.exports = Spachcock;