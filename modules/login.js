'use strict'

let login = function(login, password) {
  let p = new Promise(function(resolve, reject) {
    console.log('login is %s', login);
    console.log('password is %s', password);
    connection.request('/login').then(function(result) {
      if (result.token) {
        user.token = result.token;
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });

  return p;
};


module.exports = login;