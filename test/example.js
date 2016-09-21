/**
 * Created by bruce on 16-9-21.
 */
'use strict';
const express = require('express');
const app = express();
app.use(require('../index')());

app.get('/', (req, res, next) => {
  req.logs.warn('** Request start **');

  setTimeout(() => {
    req.logs.error('Ooops, Something\'s; wrong');
  }, 1000);

  someMethod.call(req);

  req.logs.time('slowOperation');
  setTimeout(() => {
    req.logs.timeEnd('slowOperation');
    req.logs.info('Request end');
    res.sendStatus(200)
  }, 1000)
});

function someMethod() {
  this.logs.log('In method log')
}

app.listen(2345);
require('child_process').exec('curl -I http://localhost:2345', () => {
  process.exit();
});
