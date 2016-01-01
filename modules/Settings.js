'use strict'

let connection = require('./Connection.js');

class Settings {
  constructor(desc) {
    //@NOTE: later get description via url
    _.forEach(desc, (item) => {
      let el = item.element || 'input';
      let is_name = 'is' + _.capitalize(el);
      item[is_name] = true;
    });
    this.description = desc;
  }

}

module.exports = Settings;