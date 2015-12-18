'use strict';

class Client {
    constructor(id, socketid) {
      this.id = id;
      this.socketid = socketid;
      this.button = true;
    }
}

module.exports = Client;
