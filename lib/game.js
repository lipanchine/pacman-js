var _ = require("underscore")
var PacMan = require('./pacman');
var Ghost = require('./ghost');

function Game() {
  this.players = {};
  this.sockets = {};
  this.ghostList = [];
  this.totalPlayers = 0;
  this.score = 0;
  this.width = 900;
  this.height = 900;
  this.dots = [];
  this.eatenDots = [];
  this.ghosts = {};
  this.totalDots = 0;
  this.status = 0; // 0 represent shutdown, 1 is normal, 2 is pause, 3 is special mode
  this.specialdot= []; // index of the special dots
  this.times = 0;
}

Game.prototype.newPlayer = function (socket) { // game begin
  var _this = this;
  this.players[socket.id] = new PacMan(socket.id, this);
  this.sockets[socket.id] = socket;
  // } else {
  //   this.ghosts[socket.id] = new Ghost(socket.id, this);
  //   this.sockets[socket.id] = socket;
  // }
  if(this.status == 0){
    this.status = 1;
  }
  this.totalPlayers++;
  _(this.sockets).each(function (socket) {
    _this.gameDetails(socket);
  });

 // console.log("player.id %d", player.id);
  this.listenOnKeys(socket);
};

Game.prototype.newGhost = function (socket){
  var ghosts = new Ghost(socket.id, this);
  ghosts.isAI = false;
  this.ghostList.push(ghosts);
  this.sockets[socket.id] = socket;
  if(this.ghostList.length >0){
 //   for(var i =0; i < this.ghostList.length; i++){
 //     _this.gameDetails(socket);
 //   }
  var playerIDs = this.gatherPlayerIDs();
  var ghostIDs = this.gatherGhostIDs();
  console.log("ghost socket" + socket.id);

  socket.emit("gameDetails", {pIDs: playerIDs, gIDs: ghostIDs});
  this.listenOnKeys(socket);
  }
}



Game.prototype.gameDetails = function (socket) {
  var playerIDs = this.gatherPlayerIDs();
  var ghostIDs = this.gatherGhostIDs();
  socket.emit("gameDetails", {pIDs: playerIDs, gIDs: ghostIDs});
}

Game.prototype.gatherPlayerIDs = function () {
  playerIDs = [];
  _(this.players).each(function (player) {
    console.log("player id", player.id);
    playerIDs.push(player.id);
  });
  return playerIDs;
};

Game.prototype.gatherGhostIDs = function (){
  ghostIDs = [];
  _(this.ghostList).each(function (player){
    ghostIDs.push(player.id);
  });
  if(ghostIDs.length>0){
    return ghostIDs;
  }else{
    return 0;
  }
}

Game.prototype.listenOnKeys = function (socket) {
  var _this = this;
  socket.on('keypress', function (data) {
    _(_this.players).each(function (player) {
      if (player.id == data.socket_id) {
        player.changeDirection(data.keypress);
      }
    });
    _(_this.ghosts).each(function (ghost) {
      console.log("ghost.id " + ghost.id);
      if (ghost.id == data.socket_id) {
        ghost.changeDirection(data.keypress);
//        console.log("ghost direction" + ghost.direction);
      }
    });
  });
};

Game.prototype.generateDots = function () { //normal dots and special dots
  var lineCount = this.width / 30;
  this.times ++;
  for (var i = 1; i <= lineCount; i++) {
    for (var j = 1; j <= lineCount; j++) {
      this.dots.push({
        x: (i + 0.5) * lineCount,
        y: (j + 0.5) * lineCount,
      });
//      this.totalDots ++;
//      console.log("%d",this.totalDots);
    }
  }
if(this.times < 2){
    var temp = Math.random()*300;
    this.specialdot.push({
      x: (3 + 0.5) * lineCount,
      y: (3 + 0.5) * lineCount,
      value: 1,
    });//Math.ceil(temp);// take the up bound value
  
    this.specialdot.push({
      x: (26 + 0.5) * lineCount,
      y: (3 + 0.5) * lineCount,
      value: 1,
    });//Math.ceil(temp);// take the up bound value
    this.specialdot.push({
      x: (3 + 0.5) * lineCount,
      y: (26  + 0.5) * lineCount,
      value: 1,
    });//Math.ceil(temp);// take the up bound value
    this.specialdot.push({
      x: (26 + 0.5) * lineCount,
      y: (26 + 0.5) * lineCount,
      value: 1,
    });//Math.ceil(temp);// take the up bound value
  }
};

Game.prototype.generateGhosts = function() {
  if(this.ghostList.length ==0){
    this.ghosts[0] = new Ghost(0, null, 400, 400, 0);
    this.ghosts[0].isAI = true;
    this.ghosts[1] = new Ghost(1, null, 430, 400, 1);
    this.ghosts[1].isAI = true;
    this.ghosts[2] = new Ghost(2, null, 400, 430, 2);
    this.ghosts[2].isAI = true;
    this.ghosts[3] = new Ghost(3, null, 430, 430, 3);
    this.ghosts[3].isAI = true;
  }else{
    for(var i = 0; i < this.ghostList.length; i++){
      this.ghosts[i] = new Ghost(this.ghostList[i].id, null, 400, 400,i);
      this.ghosts[i].isAI = false;
    }
    for(var i = this.ghostList.length; i < 4; i++){
      this.ghosts[i] = new Ghost(i, null, 400, 400,i);
      this.ghosts[i].isAI = true;
    }
  }
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
    _this.status = player.returnStatus();
  //  console.log("time = %d", _this.status);
    if(player.pacmanMove()) {
      _this.gameover();
    }
  });
  _(this.ghosts).each(function (ghost) {
//    console.log("ghost id" + ghost.id);
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
  var sDots = this.gatherSpecialDots();
  var gameS = this.status;
//  if(this.status == 2){
 //   console.log("%d",this.status);
 // }
  var gameStatus = {players: playersStatus, maze: mazeStatus, specialDot: sDots, ghosts: ghostsStatus, GameS: gameS};
  _(this.sockets).each(function (socket) {
    socket.emit('update', gameStatus);
  });
};

Game.prototype.gatherMazeStatus = function () {
  return this.dots; //server only return dots info
};

Game.prototype.gatherSpecialDots = function () {
  return this.specialdot; //server only return dots info
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