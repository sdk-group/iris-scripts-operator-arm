'use strict'

let _ = require('lodash');

let connection = require('./Connection.js');

class User {
  constructor() {
    this.fields = {};
    this.callback = {};
  }
  login(login, password) {
    let try_loggin = connection.request('/login', {
      login, password
    }).then((result) => {
      connection.setToken(result.token);
      return this.fields.logged_in = !!result.token;
    });

    try_loggin.then(() => {
      if (!this.isLogged()) return false;
      return connection.request('/userinfo').then((result) => _.assign(this.fields, result));
    }).then((result) => {
      this.emit('changed', true);
    });

    return try_loggin;
  }
  isLogged() {
    return this.fields.logged_in;
  }
  on(name, cb) {
    if (!this.callback.hasOwnProperty(name)) this.callback[name] = [];
    this.callback[name].push(cb);

    return this;
  }
  emit(name, data) {
    if (this.callback.hasOwnProperty(name)) {
      _.forEach(this.callback[name], (cb) => cb(data));
    }
  }
}

module.exports = User;