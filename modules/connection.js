'use strict'

class Connection {
  constructor() {
    this.methods = {};
    this.token = false;
  }
  addConnectionProvider(provider) {
    let method = provider.getMethod();
    console.log('Connection: method added', method.name);
    this.methods[method.name] = method;
    this.current_method = method.name;

  }
  getMethod(name) {
    let method_name = name || this.current_method;
    return this.methods[method_name];
  }
  setToken(token) {
    this.token = token || false;

    if (!token) return Promise.reject({
      reason: 'Invalid token'
    });

    let connections_notified = _.map(this.methods, (method) => method.auth(token));

    return Promise.all(connections_notified);
  }
  request(uri, data, method) {
    return this.getMethod(method).request(uri, data);
  }
  subscribe(uri, callback, method) {
    return this.getMethod(method).subscribe(uri, callback);
  }
  unsubscribe(uri, callback, method) {
    return this.getMethod(method).request(uri, callback);
  }
  close() {
    return _.map(this.methods, (method) => method.close())
  }
}

var connection = new Connection();

module.exports = connection;