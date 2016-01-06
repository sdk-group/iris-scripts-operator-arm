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


// let default_settings = [{
//   name: 'Группа1',
//   items: {
//     slider1: {
//       element: 'slider',
//       label: 'Слайдер',
//       default: '10',
//       params: {
//         min: 0,
//         max: 100
//       },
//       value: undefined,
//       validator: false
//     },
//     input1: {
//       element: 'input',
//       label: 'Настройка',
//       default: '00-00',
//       params: undefined,
//       value: undefined,
//       validator: false
//     },
//     checkbox1: {
//       element: 'toggle',
//       label: 'Чекалка',
//       default: 'true',
//       params: undefined,
//       value: undefined,
//       validator: false
//     },
//     list1: {
//       element: 'list',
//       label: 'Листик',
//       default: 1,
//       params: [0, 1, 2, 3],
//       value: undefined,
//       validator: false
//     },
//     dropdown1: {
//       element: 'dropdown',
//       label: 'Дроп',
//       default: 1,
//       params: ['d1', 'd2', 'd3', 'd4'],
//       value: undefined,
//       validator: false
//     }
//   }
// }];

let default_settings = [{
  name: 'Базовые настройки',
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
    },
    ip: {
      element: 'input',
      label: 'ip-адресс',
      default: '127.0.0.1'
    },
    port: {
      element: 'input',
      label: 'Порт',
      default: "80"
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