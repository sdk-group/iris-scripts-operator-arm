'use strict'

let ee2 = require('eventemitter2').EventEmitter2;

var emitter = new ee2({
  // use wildcards.
  wildcard: true,
  // if you want to emit the newListener event set to true.
  newListener: false,
  // max listeners that can be assigned to an event, default 10.
  maxListeners: 20
});

class Module {
  constructor() {
    this.emitter = emitter;
  }
  on(name, cb) {
    this.emitter.on(name, cb);
  }
  emit(name, data) {
    this.emitter.emit(name, data);
  }
  off(name, callback) {
    this.emitter.off(name, callback);
  }
}

module.exports = Module;