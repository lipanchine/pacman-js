var _ = require("underscore")
var PacMan = require('./pacman');
var Ghost = require('./ghost');

function Game() {
  this.players = {};
  this.sockets = {};
  this.totalPlayers = 0;
  this.score = 0;
  this.width = 900;
  this.height = 900;
  this.dots = [];
  this.eatenDots = [];
  this.ghosts = {};
}

Game.prototype.newPlayer = function (socket) {
  var _this = this;
  // if(this.totalPlayers == 0) {
  this.players[socket.id] = new PacMan(socket.id, this);
  this.sockets[socket.id] = socket;
  // } else {
  //   this.ghosts[socket.id] = new Ghost(socket.id, this);
  //   this.sockets[socket.id] = socket;
  // }

  this.totalPlayers++;
  _(this.sockets).each(function (socket) {
    _this.gameDetails(socket);
  });
  this.listenOnKeys(socket);
};

Game.prototype.gameDetails = function (socket) {
  var playerIDs = this.gatherPlayerIDs();
  socket.emit("gameDetails", {IDs: playerIDs})
};

Game.prototype.gatherPlayerIDs = function () {
  playerIDs = [];
  _(this.players).each(function (player) {
    playerIDs.push(player.id);
  });
  _(this.ghosts).each(function (player) {
    playerIds.push(player.id);
  });
  return playerIDs;
};

Game.prototype.listenOnKeys = function (socket) {
  var _this = this;
  socket.on('keypress', function (data) {
    _(_this.players).each(function (player) {
      if (player.id == data.socket_id) {
        player.changeDirection(data.keypress);
      }
    });
    _(_this.ghosts).each(function (player) {
      if (player.id == data.socket_id) {
        player.changeDirection(data.keypress);
      }
    });
  });
};

Game.prototype.generateDots = function () {
  var lineCount = this.width / 30;
  for (var i = 1; i <= lineCount; i++) {
    for (var j = 1; j <= lineCount; j++) {
      this.dots.push({
        x: (i + 0.5) * lineCount,
        y: (j + 0.5) * lineCount
      });
    }
  }
};

Game.prototype.generateGhosts = function() {
  this.ghosts[0] = new Ghost(0, null, 400, 400);
  this.ghosts[1] = new Ghost(1, null, 430, 400);
  this.ghosts[2] = new Ghost(2, null, 400, 430);
  this.ghosts[3] = new Ghost(3, null, 430, 430);
};

Game.prototype.init = function () {
  var _this = this;
  this.generateDots();
  this.generateGhosts();

  setInterval(function () {
    _this.movement();
    _this.updateAll();
  }, 60)
};

Game.prototype.movement = function () {
  var _this = this;
  _(this.players).each(function (player) {
    player.pacmanBite();
    if(player.pacmanMove()) {
      _this.gameover();
    }
  });
  _(this.ghosts).each(function (ghost) {
    ghost.ghostMove();
  });
};

Game.prototype.gameover = function() {
   _(this.sockets).each(function (socket) {
    socket.emit('gameover');
  });
};

Game.prototype.updateAll = function () {
  var playersStatus = this.gatherPlayerStatus();
  var ghostsStatus = this.gatherGhostsStatus();
  var mazeStatus = this.gatherMazeStatus();
  var gameStatus = {players: playersStatus, maze: mazeStatus, ghosts: ghostsStatus};
  _(this.sockets).each(function (socket) {
    socket.emit('update', gameStatus);
  });
};

Game.prototype.gatherMazeStatus = function () {
  return this.dots;
};

Game.prototype.gatherPlayerStatus = function () {
  var playerStatus = {};
  _(this.players).each(function (player) {
    playerStatus[player.id] = _(player).pick('id', 'x', 'y', 'direction',
      'mouthOpenValue', 'mouthPosition', 'score')
  });
  return playerStatus;
};

Game.prototype.gatherGhostsStatus = function() {
  var ghostStatus = {};
  _(this.ghosts).each(function (ghost) {
      ghostStatus[ghost.id]  = ghost;
  });
  return ghostStatus;
};

module.exports = Game;