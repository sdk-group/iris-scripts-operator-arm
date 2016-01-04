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
    return connection.request('/login', {
      login, password
    }).then((result) => {
      connection.setToken(result.token);
      return this.fields.logged_in = !!result.token;
    }).then(() => {
      if (!this.isLogged()) return false;
      return connection.request('/userinfo').then((result) => _.assign(this.fields, result));
    }).then((result) => {
      this.emit('user.fields.changed', this.fields);
      return true;
    });


  }
  isLogged() {
    return !!this.fields.logged_in;
  }
  logout() {
    console.log('mock for logout');
    return true;
  }
  takeBreak() {
    console.log('mock for break');
    return true;
  }
}

module.exports = User;