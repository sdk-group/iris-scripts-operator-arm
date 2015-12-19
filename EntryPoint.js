'use strict'

class EntryPoint {
  constructor() {
    this.exposed_modules = {};
  }
  attach(app) {
    this.front = app;
    let self = this;
    app.controller = {
      self() {
          return self;
        },

        require(name) {
          if (self.exposed_modules.hasOwnProperty(name)) return self.exposed_modules[name];
          throw new Error('no such module "' + name + '"');
        }
    };
  }
  expose(name, module) {
    this.exposed_modules[name] = module;
  }
}

module.exports = EntryPoint;