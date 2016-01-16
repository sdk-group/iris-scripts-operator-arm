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

    connection.subscribe(getShortcut('update_uri'), (result) => {
      let data = _.mapValues(result, (value, key) => {
        if (key === 'room') return value;
        return {
          count: value.count,
          tickets: _.map(value.tickets, (ticket_data) => this.makeTicket(ticket_data))
        };
      });

      this.emit(getShortcut('update_uri'), data);
    });

    return true;
  }
  onUpdate(callback) {
    return this.on(getShortcut('update_uri'), callback);
  }
  getNext() {
    console.log('next ticket');
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let user_id = this.user.fields.id;

    return connection.request(getShortcut('next'), user_id).then((data) => this.makeTicket(data));
  }
  getTicketById(ticket) {
    console.log('get ticket by id', ticket.getId());
    if (!this.user.isLogged()) return Promise.reject('not logged');

    let ticket_id = (ticket instanceof Ticket) ? ticket.getId() : ticket;

    return connection.request(getShortcut('specific'), ticket_id).then((data) => this.makeTicket(data));
  }
  makeTicket(data) {
    let ticket = new Ticket(data, this);
    return ticket;
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
  callAgain(ticket) {
    console.log('play sound on Room display');
  }
  changeState(state, ticket) {
    console.log('change state', state);
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