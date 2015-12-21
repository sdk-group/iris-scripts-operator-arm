'use strict'

let _ = require('lodash');

class Connection {
  constructor() {
    this.methods = {};
    this.token = false;
    this.ready = new Promise((res) => this.resolve = res);
  }
  afterConnection(cb) {
    return this.ready.then(cb);
  }
  addConnectionMethod(method) {
    console.log('method added', method.name);
    this.methods[method.name] = method;
    this.current_method = method.name;
    this.resolve(true);
  }
  getMethod(name) {
    let method_name = name || this.current_method;
    return this.methods[method_name];
  }
  request(uri, data, method) {
    return this.afterConnection(() => this.getMethod(method).request(uri, data));
  }
  setToken(token) {
    this.token = token || false;
  }
  subscribe(uir, callback, method) {
    return this.afterConnection(() => this.getMethod(method).subscribe(uri, callback));
  }
  unsubscribe(uri, callback, method) {
    return this.afterConnection(() => this.getMethod(method).request(uri, callback));
  }
}

let connection = new Connection();

module.exports = connection;