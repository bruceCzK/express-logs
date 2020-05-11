/**
 * Created by chenzhuokai on 16/5/19.
 */
'use strict'

const _ = require('lodash')
const moment = require('moment')

/**
 * LogStack prototype
 * @constructor
 * @param options {Object} {requestTiming: Boolean, format: String, precision: Number}
 *
 */
module.exports = function LogStack(options) {
  options = options || {}

  options.format = options.format || 'YYYY-MM-DD HH:mm:ss.SSS'
  options.requestTiming = options.requestTiming !== false

  const that = this

  this.createTime = now()
  this.timestamps = {}
  this.stack = []

  this.log = _log.bind(this, 'log')
  this.info = _log.bind(this, 'info')
  this.warn = _log.bind(this, 'warn')
  this.error = _log.bind(this, 'error')

  this.time = (tag) => {
    if (!tag || !_.isString(tag)) {
      return
    }
    this.timestamps[tag] = now()
  }

  this.timeEnd = (tag) => {
    if (!tag || !_.isString(tag) || !this.timestamps[tag]) {
      return
    }
    const startTime = this.timestamps[tag]
    const endTime = now()
    delete this.timestamps[tag]
    this.log('%s done, using %sms', tag, _.round((endTime - startTime) / 1000, 3))
  }

  this.output = () => {
    if (this.stack.length) {
      const endTime = now()
      if (options.requestTiming) {
        this.log('Request done using %sms', _.round((endTime - this.createTime) / 1000, 3))
      }
      console.log('----------')
      this.stack.forEach((item) => {
        const datetime = moment(item.time).format(options.format)
        item.value[0] = `[${datetime}] ${(item.value[0] || '')}`
        console[item.type].call(this, ...item.value)
      })
    }
    this.destroy()
  }

  this.destroy = () => {
    this.timestamps = null
    this.createTime = null
    this.stack = null
    delete this
  }

  function _log(type) {
    let line = {}
    line.time = new Date().toJSON()
    line.type = type
    line.value = _.chain(arguments).toArray().slice(1, arguments.length).map(log => {
      if (_.isObject(log)) {
        try {
          log = JSON.stringify(log, null, 0)
        } catch (e) {
          log = log.toString()
        }
      }
      return log
    }).value()
    that.stack.push(line)
  }
}

const now = () => {
  const hrTime = process.hrtime()
  return hrTime[0] * 1000000 + hrTime[1] / 1000
}
