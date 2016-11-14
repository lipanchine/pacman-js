var util = require('util');
var _ = require('underscore');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Game = require('./lib/game');
var Pacman = require('./lib/pacman');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

function Server() {
  this.games = {};
  this.waitingRoom = [];
}

Server.prototype.init = function () {
  _this = this;
  server.listen(port, function () {
    console.log("Server listening on port " + port);
    _this.setEventHandlers();
  });
};

Server.prototype.setEventHandlers = function () {
  _this = this;
  io.on("connection", function (socket) {
    return _this.onSocketConnection(socket, _this);
  });
};

Server.prototype.onSocketConnection = function (socket, _this) {
  util.log("New player connected" + socket.id);
  socket.on('start', function () {
    return _this.onNewPlayer(socket, _this)
  });
  socket.on("disconnect", function () {
    return _this.onClientDisconnect(this, _this)
  });
};

Server.prototype.onClientDisconnect = function (socket, _this) {
  util.log("Player has disconnected: " + socket.id);
  // _this.waitingRoom.splice(_this.waitingRoom.indexOf(socket.id), 1);
  // if (typeof _this.games[socket.id].sockets !== 'undefined') {
  //   _(_this.games[socket.id].sockets).each(function(socket) {
  //     socket.emit('opponent:disconnect');
  socket.disconnect();
  delete _this.games[socket.id];
 // delete _this.waitingRoom[socket];
  //   });
  // }
};

Server.prototype.onNewPlayer = function (socket, _this) {
  util.log("socket id : ",socket.id);
  _this.waitingRoom.push(socket);
  _this.games[socket.id] = new Game(_this.waitingRoom[0].id);
  return _this.startGame(_this.waitingRoom[0].id);
};

Server.prototype.startGame = function (socket) {
  for(var i = 0; i < _this.waitingRoom.length; i++){
    if(i == 0){
 //     this.games[socket.id] = this.games[this.waitingRoom[0].id];
      this.addPlayers(this.games[_this.waitingRoom[0].id]);
    }else{
      util.log("waitingRoom 1.id ", _this.waitingRoom[i].id);
      this.addGhost(_this.waitingRoom[i]);
    }
  }
  return this.games[this.waitingRoom[0].id].init();
};

Server.prototype.addGhost = function (socket) {
  console.log("addGhost id "+ socket.id);
  this.games[this.waitingRoom[0].id].newGhost(socket);
}

Server.prototype.addPlayers = function (game) {
  console.log("waitingRoom num : %d", this.waitingRoom.length);
  game.newPlayer(_this.waitingRoom[0]);
//  this.waitingRoom = [];
//    return game.init();
};

new Server().init();
