# express-logs

An express log middleware which add a `logs` object to request

## Usage
```
$ npm i express-logs -S
```

## Example
```
const express = require('express')
const app = express() 
app.use(require('express-logs')())

app.get('/', (req, res, next) => {
  req.logs.log('Request start.')
  
  setTimeout(() => {
    req.logs.error('Ooops, Something\'s wrong')
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
[2016-09-21T14:27:41.294Z] Request start.
[2016-09-21T14:27:41.296Z] In method log
[2016-09-21T14:27:42.297Z] Ooops, Something's; wrong
[2016-09-21T14:27:42.298Z] slowOperation done, using 1001ms
[2016-09-21T14:27:42.308Z] Request done using 1015ms

```

All logs will be printed **AFTER** the request is end.

It's a lot more convenient for debug、performance monitor in this way instead of print log immediately.

## Options
```
{
  requestTiming: [Boolean] // default is true
}
```
