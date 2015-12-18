'use strict';

class Client {
    constructor(id, socketid) {
      this.id = id;
      this.socketid = socketid;
      this.nickname = `user ${this.socketid}`;
      this.button = true;
    }
}

module.exports = Client;
