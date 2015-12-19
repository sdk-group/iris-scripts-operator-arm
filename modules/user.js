'use strict'

let connection = require('./connection.js');

class User {
  constructor() {
    this.fields = {};
  }
  login(login, password) {
    return new Promise((resolve, reject) => {
      console.log('login is %s', login);
      console.log('password is %s', password);
      connection.request('/login').then((result) => {
        this.token = result.token || 'nope';
        resolve(!!result.token);
      });
    });
  }
}

module.exports = User;