'use strict'

class Ticket {
  constructor(data, queue) {
    this.queue = queue;
    let params_map = ['ticket_id', 'label', 'service', 'service_count', 'state', 'client', 'time_bounds'];

    _.forEach(params_map, (param) => this[param] = data[param]);
  }
  getId() {
    return this.ticket_id;
  }
  getLabel() {
    return this.label;
  }
  returnToQueue() {
    let state = 'waiting';
    return this.queue.changeState(state, this)
  }
  arrived() {
    let state = 'processing';
    return this.queue.changeState(state, this);
  }
  close() {
    let state = 'closed';
    return this.queue.changeState(state, this);
  }
  postpone() {
    let state = 'postponed';
    return this.queue.changeState(state, this);
  }
  callAgain() {
    return this.queue.callAgain(this);
  }
  process() {
    return this.queue.getTicketById(this)
  }
}

module.exports = Ticket;