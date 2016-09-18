/**
 * Created by chenzhuokai on 16/7/25.
 */
const LogStack = require('./lib/log-stack');
module.exports = function (req, res, next) {
  req.logs = new LogStack();

  res.on('finish', function () {
    req.logs.output();
  });

  next();
};
