'use strict';

class Client {
    constructor(id, nickname, socketid) {
      this.id = id;
      this.socketid = socketid;
      this.nickname = nickname;
      this.button = true;
    }
}

module.exports = Client;
