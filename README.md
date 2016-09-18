# express-logs

An express log middleware which add a `logs` object to request

## Usage
```
const express = require('express')
const app = express() 

app.use(require('express-logs'))

app.get('/', (req, res, next) => {
  req.logs.log('Request start.')
  
  setTimeout(() => {
    req.logs.error('Ooops, Something's wrong')
  }, 1000)
  
  someMethod.call(req)
  
  req.logs.time('slowOperation')
  setTimeout(() => {
    req.logs.timeEnd('slowOperation')
    res.sendStatus(200)
  }, 5000)
}) 

function someMethod() {
  this.logs.log('In method log')
}
```
will print something like below
```
----------
[2016-09-18T10:00:49.000Z] Request start.
[2016-09-18T10:00:50.002Z] Ooops, Something's wrong
[2016-09-18T10:00:50.007Z] In method log
[2016-09-18T10:00:55.008Z] slowOperation process done, using 5000ms
Request using 5004ms
```

All logs will be printed **AFTER** the request is end.

It's a lot more convenient for debug、performance monitor in this way instead of print log immediately.
