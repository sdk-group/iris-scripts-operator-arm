'use strict'

let Module = require('./Module.js');

let connection = require('./Connection.js');
let arm_types = {
  'control-panel': require('./ControlPanelWorkstation.js')
};

const default_WS = [{
  type: 'control-panel',
  id: 1
}];

class User extends Module {
  constructor() {
    super();
    this.fields = {};
    this.occupied_workstations = [];
  }
  getId() {
    return this.fields.id;
  }
  getWorkstation(type) {
    return _.find(this.occupied_workstations, (ws) => {
      return ws.type == type
    });
  }
  login(login, password) {
    return connection.request('/login', {
        user: login,
        password: password
      }, 'http')
      .then((result) => result.value ? connection.setToken(result.token) : Promise.reject({
        reason: 'login failed',
        data: result
      }))
      .then(() => connection.request('/operator/info'))
      .then((result) => {
        this.fields.logged_in = true;
        _.assign(this.fields, result);
        return this.initWS();
      })
      .then(() => {
        this.emit('user.fields.changed', this.fields);
        return true;
      });
  }
  isLogged() {
    return !!this.fields.logged_in;
  }
  logout() {
    console.log('mock for logout');
    return true;
  }
  takeBreak() {
    console.log('mock for break');
    return true;
  }
  initWS() {
    let workstations = this.fields.workstations;
    let init = _.map(default_WS, (ws) => {
      let init_data = workstations[ws.type][ws.id];
      if (!arm_types.hasOwnProperty(ws.type)) {
        throw new Error('Unknown arm type');
      }
      let Model = arm_types[ws.type];
      let WS = new Model(this);

      this.occupied_workstations.push(WS);

      return WS.init(ws.id, init_data);
    });

    return Promise.all(init);
  }
}

module.exports = User;