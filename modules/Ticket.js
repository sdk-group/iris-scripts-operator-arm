'use strict'

class Ticket {
  constructor(data, queue) {
    this.queue = queue;
    let params_map = {
      'ticket_id': {},
      'label': {},
      'service': {},
      'service_count': {},
      'state': {},
      'client': {},
      'time_description': {},
      'booking_date': {
        transform: function(utc_date) {
          let date = new Date(utc_date);
          return date.getTime();
        }
      }
    };

    _.forEach(params_map, (param_data, param_name) => {
      let name = param_data.name || param_name;
      let value = param_data.transform instanceof Function ? param_data.transform(data[param_name]) : data[param_name];

      this[name] = value;
    });
  }
  getId() {
    return this.ticket_id;
  }
  getLabel() {
    return this.label;
  }
  returnToQueue() {
    let state = 'open';
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