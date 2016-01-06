'use strict'

let Module = require('./Module.js');

let connection = require('./Connection.js');
let Ticket = require('./Ticket.js');
let ShortcutRegistry = require('./ShortcutRegistry.js');

let getShortcut = ShortcutRegistry.getShortcut.bind(ShortcutRegistry, 'queue');

class ControlPanelWorkstation extends Module {
  constructor(user) {
    super();
    this.user = user;
    this.type = 'control-panel';
    this.current_ticket = false;
  }
  init(id, data) {
    this.label = data.label;
    this.id = id;

    let callback = (data) => {
      this.emit('queue.update', data);
    };

    this.user.on('user.fields.changed', () => {
      if (this.user.isLogged()) {
        connection.subscribe(getShortcut('update_uri'), callback);
      } else {
        connection.unsubscribe(getShortcut('update_uri'), callback);
      }
    });

    return true;
  }
  getNext() {
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let user_id = this.user.fields.id;

    return connection.request(getShortcut('next'), user_id).then((data) => this.makeTicket(data));
  }
  getTicketById(ticket) {
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
  getQueuePage(state, limit, offset) {
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let user_id = this.user.fields.id;

    return connection.request(getShortcut('list'), {
      user_id,
      state,
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

module.exports = ControlPanelWorkstation;