'use strict'

let connection = require('./connection.js');
let ShortcutRegistry = require('./ShortcutRegistry.js');

let getShortcut = ShortcutRegistry.getShortcut.bind(ShortcutRegistry, 'queue');

class Queue {
  constructor(user) {
    this.user = user;
    this.in_queue = 0;
    this.waiting = 0;
    connection.subscribe(getShortcut('update_uri'), this.queueUpdate);
  }
  queueUpdate(queuedata) {
    this.in_queue = queuedata.status.in_queue;
    this.waiting = queuedata.status.postponed;
  }
  getNextTicket() {
    if (!this.user.fields.logged_in) return Promise.reject('not logged');

    let user_id = this.user.fields.id;

    return connection.request(getShortcut('next'), user_id);
  }
  getSpecificTicket(ticket) {
    if (!this.user.fields.logged_in) return Promise.reject('not logged');

    let ticket_id = ticket.getId();

    return connection.request(getShortcut('specific'), ticket_id);
  }
  postponeTicket(ticket) {
    if (!this.user.fields.logged_in) return Promise.reject('not logged');

    let ticket_id = ticket.getId();

    return connection.request(getShortcut('postpone'), ticket_id);
  }
  redirectTicket(ticket, route) {
    if (!this.user.fields.logged_in) return Promise.reject('not logged');

    let ticket_id = ticket.getId();

    return connection.request(getShortcut('redirect'), {
      ticket_id,
      route
    });
  }
}

module.exports = Queue;