'use strict'

let Module = require('./Module.js');

let connection = require('./Connection.js');
let arm_types = {
  'control-panel': require('./ControlPanelWorkstation.js')
};


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
        reason: result.reason,
        data: result
      }))
      .then(() => connection.request('/operator/info'))
      .then((result) => this.setFields(result) && this.initWS())
      .then(() => {
        this.emit('user.fields.changed', this.fields);
        return true;
      });
  }
  isLogged() {
    return !!this.fields.logged_in;
  }
  logout() {
    return connection.request('/logout', {}, 'http').then((result) => {
      if (!result.value) return Promise.reject(result);

      this.fields.logged_in = false;
      connection.close();
      this.emit('user.fields.changed', this.fields);
      return true;
    });
  }
  takeBreak() {
    console.log('mock for break');
    return connection.request('/logout', {}, 'http')
  }
  setFields(result) {
    this.fields.logged_in = true;
    let key = _.keys(result.employee)[0];
    this.fields.name = result.employee[key].first_name;
    this.fields.lastname = result.employee[key].last_name;
    this.fields.middlename = result.employee[key].middle_name;
    this.fields.wp = result.wp;
    return true;
  }
  initWS() {
    let workstations = this.fields.wp;
    //@FIXIT: ws picker
    let default_WS = _.keys(workstations).slice(0, 1);

    let init = _.map(default_WS, (ws) => {
      let init_data = workstations[ws];

      let type = init_data.device_type;
      console.log(type);
      if (!arm_types.hasOwnProperty(type)) {
        throw new Error('Unknown arm type');
      }
      let Model = arm_types[type];
      let WS = new Model(this);

      this.occupied_workstations.push(WS);

      return WS.init(ws.id, init_data);
    });

    return Promise.all(init);
  }
}

module.exports = User;