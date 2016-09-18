/**
 * Created by chenzhuokai on 16/5/19.
 */
'use strict';

const _ = require('lodash');

module.exports = function LogStack() {
  const that = this;
  let timestamps = {};
  this.stack = [];
  const createTime = new Date().getTime();

  ['log', 'info', 'warn', 'error'].forEach((method) => {
    this[method] = _log.bind(this, method);
  });

  this.getLogs = () => {
    return this.logs.map((item) => {
      `[${item.time}] ${item.value}`
    }).join('\n');
  };

  this.time = (tag) => {
    if (!tag) {
      return;
    }
    timestamps[tag] = new Date().getTime();
  };

  this.time = (tag) => {
    if (!tag || !_.isString(tag)) {
      return;
    }
    timestamps[tag] = new Date().getTime();
  };

  this.timeEnd = (tag) => {
    if (!tag || !_.isString(tag) || !timestamps[tag]) {
      return;
    }
    timestamps[tag + 'End'] = new Date().getTime();
    this.log('%s process done, using %s', tag, timestamps[tag + 'End'] - timestamps[tag] + 'ms');
  };

  this.output = () => {
    if (this.stack.length) {
      const endTime = new Date().getTime();
      console.log('----------');
      this.stack.forEach((item) => {
        item.value[0] = `[${item.time}] ` + (item.value[0] || '');
        console[item.type].call(this, ...item.value);
      });
      console.log('Request using %sms', endTime - createTime)
    }
    this.destroy();
  };

  this.destroy = () => {
    timestamps = null;
    this.stack = null;
    delete this;
  };

  function _log(type) {
    let line = {};
    line.time = new Date().toJSON();
    line.type = type;
    line.value = _(arguments).toArray().slice(1, arguments.length).map((log) => {
      if (_.isObject(log)) {
        try {
          log = JSON.stringify(log, null, 0);
        } catch (e) {
        }
      }
      return log;
    }).value();
    that.stack.push(line);
  }
};
