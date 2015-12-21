'use strict'

let Module = require('./Module.js');

let connection = require('./connection.js');
let Ticket = require('./Ticket.js');
let ShortcutRegistry = require('./ShortcutRegistry.js');

let getShortcut = ShortcutRegistry.getShortcut.bind(ShortcutRegistry, 'queue');

class Queue extends Module {
  constructor(user) {
    super();
    this.user = user;
    this.in_queue = 0;
    this.waiting = 0;
    this.current_ticket = false;
    connection.subscribe(getShortcut('update_uri'), (data) => {
      this.emit('queue.update', data);
    });
  }
  getNextTicket() {
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let user_id = this.user.fields.id;

    return connection.request(getShortcut('next'), user_id).then((data) => this.makeTicket(data));
  }
  getSpecificTicket(ticket) {
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let ticket_id = (tiket instanceof Ticket) ? ticket.getId() : ticket;

    return connection.request(getShortcut('specific'), ticket_id).then((data) => this.makeTicket(data));
  }
  makeTicket(data) {
    if (!data) return Promise.resolve('no such ticket');

    this.current_ticket = new Ticket(data, this);
    return this.current_ticket;
  }
  redirectTicket(route, ticket) {
    if (!this.user.isLogged()) return Promise.reject('not logged');
    ticket = ticket || this.current_ticket;
    let ticket_id = ticket.getId();

    return connection.request(getShortcut('redirect'), {
      ticket_id,
      route
    });
  }
  listTickets(count = 10) {
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let user_id = this.user.fields.id;

    return connection.request(getShortcut('list'), {
      user_id,
      count
    });
  }
  changeState(state, ticket) {
    if (!this.user.isLogged()) return Promise.reject('not logged');

    ticket = ticket || this.current_ticket;
    let ticket_id = ticket.getId();

    return connection.request(getShortcut('state'), {
      ticket_id,
      state
    });
  }
}

module.exports = Queue;