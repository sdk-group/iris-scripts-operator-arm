'use strict'

class Connection {
  constructor() {
    this.methods = {};
    this.token = false;
    let self = this;
    this.ready = new Promise(function(res) {
      self.resolve = res
    });
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
  subscribe(uri, callback, method) {
    return this.afterConnection(() => this.getMethod(method).subscribe(uri, callback));
  }
  unsubscribe(uri, callback, method) {
    return this.afterConnection(() => this.getMethod(method).request(uri, callback));
  }
}

var connection = new Connection();

module.exports = connection;