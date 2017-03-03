module.exports = {
  bar: function (req, res) {
    res.json({err: false, data: {"requestUrl": req.url}});
  }
};