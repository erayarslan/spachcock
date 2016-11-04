/*
 *   spachcock
 *   Author : Eray 'maia' Arslan
 *   Email  : relfishere@gmail.com
 *   Blog   : http://eray.js.org/
 *   This project is released under the MIT license.
 */

module.exports = {
  hasOwnProperty: Object.prototype.hasOwnProperty,
  /**
   * @param {String} val - Value.
   * @returns {String}
   */
  DecodeParam: function (val) {
    if (typeof val !== 'string' || val.length === 0) {
      return val;
    }

    try {
      return decodeURIComponent(val);
    } catch (err) {
      if (err instanceof URIError) {
        err.message = 'Failed to decode param \'' + val + '\'';
        err.status = err.statusCode = 400;
      }

      throw err;
    }
  },
  nothing: function () {
  }
};
