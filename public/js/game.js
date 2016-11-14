function Game(canvas, context, socket) {
  this.socket = socket;
  this.canvas = canvas;
  this.context = context;
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.players = {};
  this.ghosts = {};
  this.clientID = null;
//  this.status = 0; // 0 represent shutdown, 1 is normal, 2 is pause, 3 is special mode
}

Game.prototype.startGame = function () {
  this.socket.emit('start');
  this.linkToGameServer();
  this.listenForKey();
  this.listenForUpdate();
  this.listenForScore();
  // this.listenForWaiting();
  this.listenForGameover();
  this.listenForDisconnect();
};

Game.prototype.addGhosts = function (id) {
  this.ghosts[id] = new Ghost(id);
};

Game.prototype.listenForKey = function () {
  _this = this;
  $(document).keydown(function (event) {
    var key = event.which;
    if ([37, 38, 39, 40].indexOf(key) > -1) {
      event.preventDefault();
    }
    _this.socket.emit('keypress', {keypress: key, socket_id: _this.clientID});
  });
};

Game.prototype.linkToGameServer = function () {
  var _this = this;
  this.socket.on('gameDetails', function (gameID) {
    console.log("2eme player");
    _this.applyLinkToGame(gameID)
  });
};

Game.prototype.applyLinkToGame = function (gameID) {
  var _this = this;
  var _socketid = _this.socket.id;
  this.setClientID(this.socket.io.engine.id);
  _(gameID.pIDs).each(function (id) {
    if(_socketid == id){
      _this.newPlayer(id);
    }
  });
  var numGhost =0;
  _(gameID.gIDs).each(function (id) {
//      console.log("id " + id);
    numGhost ++;
    _this.addGhosts(id);
  });  
  for(var i = numGhost; i< 4 ; i++){
    _this.addGhosts(i);
  }
};

Game.prototype.setClientID = function (uniqueID) {
  return this.clientID = this.clientID || uniqueID;
};

Game.prototype.newPlayer = function (id) {
  return this.players[id] = new Pacman(id);
};

Game.prototype.newGhost = function (id) {
  return this.ghosts[id] = new Ghost(id);
};

Game.prototype.listenForUpdate = function () {
  _this = this;
  this.socket.on('update', function (status) {
    _this.renderAll(status);
  });
};

Game.prototype.renderAll = function (statuses) {
  _this = this;
  this.context.clearRect(0, 0, this.width, this.height);
  drawGrid(statuses.maze, statuses.specialDot);
  var num =0;
  _(this.ghosts).each(function (ghost) {
    console.log("#########");
    console.log("ghost.id" + ghost.id);
    console.log("#########");
  });
  _(statuses.ghosts).each(function (ghost) {
    console.log("ghost id "+ ghost.id );
    if(ghost.id == 0 || ghost.id == 1 || ghost.id == 2 ||ghost.id == 3 ){
      _this.ghosts[ghost.id].render(ghost, _this.context);
    }else{
      delete(_(this.ghosts)[num]);
      _this.addGhosts(ghost.id);
      num ++;
      _this.ghosts[ghost.id].render(ghost, _this.context);
    }
  });

  _(statuses.players).each(function (player) {
    console.log("player id :" + player.id);

    if(_this.players[player.id]  == null){
      _this.players[player.id] = new Pacman(player.id);
    }
    _this.players[player.id].render(_this.context, player, statuses.GameS);
  });
};

Game.prototype.listenForScore = function () {
  this.socket.on('update:score', function (score) {
    $("#point-count").text(score);
  });
};

Game.prototype.listenForDisconnect = function () {
  _this = this;
  var message = 'Your opponent has quit. Please start a new game';
  this.socket.on('opponent:disconnect', function () {
    drawGameStatus(message, _this.context, _this.width, _this.height);
  });
};

// Game.prototype.listenForWaiting = function () {
//   _this = this;
//   var message = "Waiting for your opponent. Prepare your muscles!";
//   this.socket.on('waiting', function () {
//     drawGameStatus(message, _this.context, _this.width, _this.height);
//   });
// };

Game.prototype.listenForGameover = function() {
  _this = this;
  var message = 'Le jeu est fini! Veuillez refraichir ce page!';
  this.socket.on('gameover', function() {
    _this.socket.removeListener('update');
    drawGameStatus(message, _this.context, _this.width, _this.height);
  })
};


$(document).ready(function () {
  $('#player-name-button').on('click', function () {
    var playerName = $('#player-name-form').val();
    $('#player-name').text('Welcome' + ' ' + playerName);
    $('#player-name-form').hide();
    $('#player-name-button').hide();
    joinGame(playerName)
  });

  function joinGame() {
    var canvas = $("#canvas")[0];
    var context = canvas.getContext("2d");
    var socket = io();
    return new Game(canvas, context, socket).startGame();
  }
});


  