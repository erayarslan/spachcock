var _ = require("lodash");

var Response = function (spachcock, client) {
  this.app = spachcock;
  this.client = client;
  return this;
};

Response.prototype.doString = function (data) {
  return _.isObject(data) ? JSON.stringify(data) : data;
};

Response.prototype._write = function (data) {
  var out = this.doString(data);
  if (this.client) {
    if (this.client.send) {
      this.client.send(out);
    } else if (this.client.write) {
      this.client.write(out);
    }
  } else {
    this.app.response(out);
  }
};

Response.prototype.redirect = function (path, data) {
  this.app.handle(data || {}, path);
  return this;
};

Response.prototype.json = function (data) {
  this._write(data);
  return this;
};

Response.prototype.end = function (data) {
  this._write(data || "");
  return this;
};

Response.prototype.send = function (data) {
  this._write(data);
  return this;
};

Response.prototype.emit = function (namespace, data) {
  if (this.client && this.client.emit) {
    this.client.emit(namespace, data);
  }
  return this;
};

module.exports = Response;
