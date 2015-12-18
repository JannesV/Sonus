'use strict';

module.exports.register = (server, options, next) => {

  let clients = [];
  let Client = require('../models/Client');
  let io = require('socket.io')(server.listener);
      io.set('transports', ['websocket']);
    io.set('polling duration', 10);

  io.on('connection', socket => {
    console.log('CONNECT')

    let maxId = 0;

    if (clients.length > 0) {
      clients.forEach(client => {
        if(client.id > maxId){
          maxId = client.id;
        }
      });
    }

    let client = new Client(maxId + 1, socket.id);
    clients.push(client);

    socket.emit('init', clients);

    socket.on('disconnect', () => {
      clients = clients.filter(c => c.socketid !== socket.id);
      socket.broadcast.emit('user_disconnect', socket.id);
    });

  });

  console.log('SONUS SERVER');
  next();

};

module.exports.register.attributes = {
  name: 'sonus-server',
  version: '0.1.0'
};
