/*
 *   spachcock
 *   Author : Eray 'maia' Arslan
 *   Email  : relfishere@gmail.com
 *   Blog   : http://eray.js.org/
 *   This project is released under the MIT license.
 */

var _ = require("lodash");

/**
 * @param {Spachcock} spachcock - Spachcock Object.
 * @param {Object} client - Socket Client Object.
 * @returns {Response}
 */
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

/**
 *
 * @param data
 * @returns {Response}
 */
Response.prototype.json = function (data) {
  this._write(data);
  return this;
};

/**
 *
 * @param data
 * @returns {Response}
 */
Response.prototype.end = function (data) {
  this._write(data || "");
  return this;
};

/**
 *
 * @param data
 * @returns {Response}
 */
Response.prototype.send = function (data) {
  this._write(data);
  return this;
};

/**
 * @param namespace
 * @param data
 * @returns {Response}
 */
Response.prototype.emit = function (namespace, data) {
  if (this.client && this.client.emit) {
    this.client.emit(namespace, data);
  }
  return this;
};

module.exports = Response;
