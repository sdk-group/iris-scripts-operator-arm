'use strict'

let ShortcutRegistry = require('./modules/ShortcutRegistry.js');

let init_data = {
  'queue': {
    update_uri: 'listen://queue/update',
    next: '/queue/get/next',
    specific: '/queue/get/specific',
    postpone: '/queue/postpone',
    redirect: '/queue/redirect',
    close: '/queue/close',
    list: '/queue/list'
  }
};

ShortcutRegistry.init(init_data);

let Entry = require('./EntryPoint.js');
let User = require('./modules/User.js');
let Queue = require('./modules/Queue.js');
let connection = require('./modules/Connection.js');

let arm_operator = new User();
let qeue = new Queue(arm_operator);
let entry = new Entry();

entry.expose('connection', connection);
entry.expose('user', arm_operator);
entry.expose('queue', queue);

module.exports = entry;