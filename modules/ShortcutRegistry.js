'use strict'

let shortcuts = {};

class ShortcutRegistry {
  constructor() {
    throw new Error('singletone');
  }
  static init(data) {
    shortcuts = _.cloneDeep(data);
  }
  static getShortcut(group, name) {
    return _.get(shortcuts, [group, name])
  }
  static addShortcut(group, name, shortcut) {
    _.set(shortcuts, [group, name], shortcut);
    return this;
  }
}

module.exports = ShortcutRegistry;