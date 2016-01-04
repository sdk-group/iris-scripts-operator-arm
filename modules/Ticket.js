'use strict'

class Ticket {
  constructor(data, queue) {
    this.queue = queue;
  }
  getId() {
    return this.ticket_id;
  }
  getInfo() {
    return this.info;
  }
  getLabel() {
    //@NOTE: former human redable id

  }
  waiting() {
    let state = 'waiting';
    return this.queue.changeState(state, this)
  }
  processing() {
    let state = 'processing';
    return this.queue.changeState(state, this);
  }
  closed() {
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
}

module.exports = Ticket;