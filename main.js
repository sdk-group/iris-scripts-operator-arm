'use strict'

let uuid = require('node-uuid');

class Main {
  constructor() {
    this.id = uuid.v1();
  }
  attach(app) {
    this.front = app;
    let self = this;
    app.controller = {
      self() {
          return self;
        },
        require(name) {
          console.log(name);
        }
    };

  }
}

module.exports = Main;