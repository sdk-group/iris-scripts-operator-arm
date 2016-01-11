'use strict'

let ShortcutRegistry = require('./modules/ShortcutRegistry.js');

let init_data = {
  'queue': {
    update_uri: 'listen://queue/update',
    next: '/queue/get/next',
    specific: '/queue/get/specific',
    list: '/queue/list',
    list: '/queue/ticket/state'
  }
};

let default_settings = [{
  name: 'API',
  items: {
    api_server: {
      element: 'input',
      label: 'Сервер',
      default: 'localhost'
    },
    api_port: {
      element: 'input',
      label: 'Порт',
      default: '80'
    }
  }
}, {
  name: 'Рабочее место',
  items: {
    office_id: {
      element: 'input',
      label: 'Номер офиса',
      default: '0'
    },
    workstation_id: {
      element: 'input',
      label: 'Номер рабочего места',
      default: '0'
    }
  }
}];

ShortcutRegistry.init(init_data);

let Entry = require('./EntryPoint.js');
let User = require('./modules/User.js');
let Settings = require('./modules/Settings.js');
let connection = require('./modules/Connection.js');
let History = require('./modules/History.js');

let arm_settings = new Settings(default_settings);
let arm_operator = new User();
let arm_history = new History();

let entry = new Entry();

entry.expose('connection', connection);
entry.expose('user', arm_operator);
entry.expose('settings', arm_settings);
entry.expose('history', arm_history);

module.exports = entry;