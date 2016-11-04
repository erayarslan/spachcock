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
 * @returns {Request}
 */
var Request = function (spachcock) {
  this.app = spachcock;
  return this;
};

module.exports = Request;
