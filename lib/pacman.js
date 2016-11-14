var _ = require("underscore");
var ParentModel = require("./ParentModel");
var Maze = require("./maze");

function PacMan (id, game) {
  this.id = id;
  this.x = 50;
  this.y = 45;
  this.maze = Maze;
  this.radius = 5;
  this.clearance = this.radius * 2;
  this.speed = 5;
  this.mouthOpenValue = 40;
  this.mouthPosition = -1;
  this.direction = 'right';
  this.score = 0;
  this.game = game;
  this.status = 1;
  this.changeBegin = new Date(2017,12,30);
}

ParentModel.inherit(PacMan);

PacMan.prototype.changeDirection = function (key) {
  if(key == "37") this.direction = "left";
  else if(key == "38") this.direction = "up";
  else if(key == "39") this.direction = "right";
  else if(key == "40") this.direction = "down";
};


PacMan.prototype.pacmanMove = function() {
  this.checkDot();
  if(this.checkGhost()) return true;
  if (this.stopDirectionBlocked()) return false;
  else if(this.direction == "right") this.x+= this.speed;
  else if(this.direction == "left") this.x-= this.speed;
  else if(this.direction == "up") this.y-= this.speed;
  else if(this.direction == "down") this.y+= this.speed;
  return false;
};

PacMan.prototype.checkDot = function() {
  var _this = this.game;
  var dot = this.game.dots;
  for (var i = dot.length-1; i >= 0; i--) {
    if ((this.x - this.radius-5) <= dot[i].x && dot[i].x <= (this.x + this.radius+5)) {
      if ((this.y - this.radius-5) <= dot[i].y && dot[i].y <= (this.y + this.radius+5)) {
        this.score++;
        this.game.eatenDots.push(this.game.dots.splice(i, 1));
        this.game.sockets[this.id].emit('update:score', this.score);
        }
      }
    }
  for (var i = this.game.specialdot.length-1; i >= 0; i--) {
    if ((this.x - this.radius-5) <= this.game.specialdot[i].x && this.game.specialdot[i].x <= (this.x + this.radius+5)) {
        if ((this.y - this.radius-5) <= this.game.specialdot[i].y && this.game.specialdot[i].y <= (this.y + this.radius+5) && this.game.specialdot[i].value ==1) {
          this.score++;
          this.game.sockets[this.id].emit('update:score', this.score);
          this.game.specialdot[i].value = -1;
          this.status = 2;
          this.speed = 10;
          this.changeBegin = new Date();
        }
      }
    }
};

PacMan.prototype.returnStatus = function(){
  var currenttime = new Date();
  if(this.status != 1 && (currenttime.getTime() - this.changeBegin.getTime() > 10000)){
    this.status = 1;
    this.speed = 5;
  }
  return this.status;
}

PacMan.prototype.checkGhost = function() {
  var ghosts = this.game.ghosts;
  var _this = this;
  var killed = false;
  _(ghosts).each(function (ghost) {
    if(Math.abs(_this.x - ghost.x) <= _this.radius + 5 && Math.abs(_this.y - ghost.y) <= _this.radius + 5){
      if(_this.game.status == 1){
        killed = true;
        return true;
      }else{
        if(_this.game.status == 2){
          ghost.x = 400;
          ghost.y = 400;
          killed = false;
          return false;
        }
      }
    }
  });
  return killed;
};

PacMan.prototype.pacmanBite = function() {
  if (this.mouthOpenValue <= 0) {
    this.mouthPosition = 1;
  }
  else if (this.mouthOpenValue >= 40){
    this.mouthPosition = -1;
  }
  this.mouthOpenValue += (5 * this.mouthPosition);
};

PacMan.prototype.stopDirectionBlocked = function() {
  var textDir = this.direction[0].toUpperCase() + this.direction.slice(1);
  return this.blockChecker().indexOf(textDir) !== -1;
};

module.exports = PacMan;
