'use strict'

class EntryPoint {
  constructor() {
    this.exposed_modules = {};
  }
  attach(app) {
    this.front = app;
    app.controller = this;
  }
  expose(name, module) {
    this.exposed_modules[name] = module;
  }
  self() {
    return this;
  }
  require(name) {
    if (this.exposed_modules.hasOwnProperty(name)) return this.exposed_modules[name];
    throw new Error('no such module "' + name + '"');
  }
}

module.exports = EntryPoint;