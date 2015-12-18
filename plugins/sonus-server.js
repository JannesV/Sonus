'use strict';

module.exports.register = (server, options, next) => {

  let clients = [];
  let Client = require('../models/Client');

  let io = server.plugins['hapi-io'].io;

  io.on('connection', socket => {

    let maxId = 0;

    if (clients.length > 0) {
      clients.forEach(client => {
        if(client.id > maxId){
          maxId = client.id;
        }
      });
    }
    let usernames = ['Playboyize', 'Gigastrength', 'Deadlyinx', 'Techpill', 'Methshot', 'Methnerd', 'TreeEater', 'PackManBrainlure', 'Carnalpleasure', 'Sharpcharm', 'Snarelure', 'Skullbone', 'Burnblaze', 'Emberburn', 'Emberfire', 'Evilember', 'Firespawn', 'Flameblow', 'SniperGod', 'TalkBomber', 'SniperWish', 'RavySnake', 'WebTool', 'TurtleCat', 'BlogWobbles', 'LuckyDusty', 'RumChicken', 'StonedTime', 'CouchChiller', 'VisualMaster', 'DeathDog', 'ZeroReborn', 'TechHater', 'eGremlin', 'BinaryMan', 'AwesomeTucker', 'FastChef', 'JunkTop', 'PurpleCharger', 'CodeBuns', 'BunnyJinx', 'GoogleCat', 'StrangeWizard', 'Fuzzy_Logic', 'New_Cliche', 'Ignoramus', 'Stupidasole', 'whereismyname', 'Nojokur', 'Illusionz', 'Spazyfool', 'Supergrass', 'Dreamworx', 'Fried_Sushi', 'Stark_Naked', 'Need_TLC', 'Raving_Cute', 'Nude_Bikergirl', 'Lunatick', 'GarbageCanLid', 'Crazy_Nice', 'Booteefool', 'Harmless_Venom', 'Lord_Tryzalot', 'Sir_Gallonhead', 'Boy_vs_Girl', 'MPmaster', 'King_Martha', 'Spamalot', 'Soft_member', 'girlDog', 'Evil_kitten', 'farquit', 'viagrandad', 'happy_sad', 'haveahappyday', 'SomethingNew', '5mileys', 'cum2soon', 'takes2long', 'w8t4u', 'askme', 'Bidwell', 'massdebater', 'iluvmen', 'Inmate', 'idontknow', 'likme', 'lostmypassword', 'kizzmybutt', 'hairygrape', 'Poker_Star'];

    let client = new Client(maxId + 1, usernames[Math.floor(Math.random() * usernames.length)], socket.id);
    clients.push(client);

    socket.emit('init', clients);

    socket.on('disconnect', () => {
      console.log('dissconnect');
      clients = clients.filter(c => c.socketid !== socket.id);
      socket.broadcast.emit('user_disconnect', socket.id);
    });

    socket.on('watch', (data) => {
      io.sockets.connected[data.targetSocketid].emit('view', data.mySocketid);
    });

    socket.on('draw', data => {
      console.log(data);
      io.sockets.connected[data.socketid].emit('draw_update', data.particles);
    });

    socket.broadcast.emit('user_joined', client);

  });

  console.log('SONUS SERVER');
  next();

};

module.exports.register.attributes = {
  name: 'sonus-server',
  version: '0.1.0'
};
