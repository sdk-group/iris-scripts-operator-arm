'use strict'

let Entry = require('./EntryPoint.js');
let User = require('./modules/User.js');
let connection = require('./modules/Connection.js');

let arm_operator = new User();
let entry = new Entry();

entry.expose('connection', connection);
entry.expose('user', arm_operator);

module.exports = entry;