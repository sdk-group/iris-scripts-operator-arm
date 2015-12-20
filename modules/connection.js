'use strict'

let _ = require('lodash');

class Connection {
  constructor() {
    this.methods = {};
    this.token = false;
  }
  addConnectionMethod(method) {
    console.log('method added', method.name);
    this.methods[method.name] = method;
    this.current_method = method.name;
  }
  getMethod(name) {
    let method_name = name || this.current_method;
    return this.methods[method_name];
  }
  request(uri, data, method) {
    if (!_.size(this.methods)) throw new Error('no connection methods');
    return this.getMethod(method).request(uri, data);
  }
  setToken(token) {
    this.token = token || false;
  }
  subscribe(uir, callback, method) {
    if (!_.size(this.methods)) throw new Error('no connection methods');
    return this.getMethod(method).subscribe(uri, callback);
  }
  unsubscribe(uri, callback, method) {
    if (!_.size(this.methods)) throw new Error('no connection methods');
    return this.getMethod(method).request(uri, callback);
  }
}

let connection = new Connection();

module.exports = connection;