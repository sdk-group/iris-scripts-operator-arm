'use strict'

let Module = require('./Module.js');

let connection = require('./Connection.js');

class User extends Module {
  constructor() {
    super();
    this.fields = {};
  }
  getId() {
    return this.fields.id;
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
      this.emit('user.fields.changed', this.fields);
    });

    return try_loggin;
  }
  isLogged() {
    return this.fields.logged_in;
  }
}

module.exports = User;