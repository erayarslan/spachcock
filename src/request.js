var _ = require("lodash");

var Request = function (spachcock) {
  this.app = spachcock;
  return this;
};

module.exports = Request;
