'use strict'

let _ = require('lodash');

let connection = require('./Connection.js');

class User {
  constructor() {
    this.fields = {};
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
    });

    return try_loggin;
  }
  isLogged() {
    return this.fields.logged_in;
  }
}

module.exports = User;