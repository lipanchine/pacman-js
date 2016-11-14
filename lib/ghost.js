var _ = require("underscore");
var ParentModel = require("./ParentModel");
var Maze = require("./maze");

var ghostColors = ['orange', 'pink', 'red', 'blue'];
function Ghost(id, game, x, y, color) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.maze = Maze;
  this.width = 25;
  this.height = 25;
  this.direction ="right";
  this.speed = 5;
  this.out = false;
  this.ai = true;
  this.exitX = 555;
  this.exitY = 465;
  this.game = game;
  this.src = 'images/' + ghostColors[color] + '_ghost_lookleft.png';
  this.throttle = 2000;

}

ParentModel.inherit(Ghost);

Ghost.prototype.outEntry = function () {
  if (this.ai && !this.out) {
    var inExitY = Math.abs(this.y - this.exitY) <= 5;
    var inExitX = Math.abs(this.x - this.exitX) <= 5;

    if (inExitY) {
      this.y = this.exitY;
      //change y first then change x
      if (inExitX) {
        this.x = this.exitX;
      } else {
        this.x += this.speed;
      }
    } else if (this.y < this.exitY) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }

    if (inExitX && inExitY) {
      this.out = true;
      this.direction = Math.floor(Math.random(2) + 1) == 1 ? 'up' : 'down';
      this.lastChangeDirAt = new Date().getTime();
    }
  }
};

/**
 * If is around the exit of ghost, it can't turn left
 * @returns {boolean}
 */
Ghost.prototype.isAroundExit = function(){
  return Math.abs(this.x - this.exitX) <= 5 && Math.abs(this.y - this.exitY) <= 5;
};

Ghost.prototype.availableDirs = function () {
  var dirs = [];
  var blockChecker = this.blockChecker();
  if (blockChecker.indexOf('Right') == -1) dirs.push('right');
  if (blockChecker.indexOf('Left') == -1 && !this.isAroundExit()) dirs.push('left');
  if (blockChecker.indexOf('Up') == -1) dirs.push('up');
  if (blockChecker.indexOf('Down') == -1) dirs.push('down');
  return dirs;
};

Ghost.prototype.stopDirectionBlocked = function () {
  var textDir = this.direction[0].toUpperCase() + this.direction.slice(1);
//  console.log("textdir = "+ textDir);
  return this.blockChecker().indexOf(textDir) != -1;
};

Ghost.prototype.randomDir = function(dirs) {
  var next = Math.floor(Math.random() * dirs.length);
  return dirs[next];
};

Ghost.prototype.ghostMove = function () {
  if(this.isAI == true){
    if (!this.out) {
      this.outEntry();
    } else {
      //ghost will change direction
      var availableDirs = this.availableDirs();

      //1. when there's a cross
      if(this.ai) {
        if (availableDirs.length > 2) { //a cross
          var current = new Date().getTime();
          if( current - this.lastChangeDirAt > this.throttle) {
            this.direction = this.randomDir(availableDirs);
            this.lastChangeDirAt = current;
          }
        }
      }

      //2. when it stops
      if (this.stopDirectionBlocked()) {
        if (this.ai) {
          this.direction = this.randomDir(availableDirs);
        }
      }
      else if (this.direction == "right") this.x += this.speed;
      else if (this.direction == "left") this.x -= this.speed;
      else if (this.direction == "up") this.y -= this.speed;
      else if (this.direction == "down") this.y += this.speed;
    }
  }else{
 //   console.log("AI id:" + this.id);
    if (this.stopDirectionBlocked()){
 //     console.log("i am blocked");
      console.log("My direction" + this.direction);
     return false;
   }
    if(this.direction == "right") {
      this.x+= this.speed;
 //     console.log("changed succed");
 //     console.log("this.direction" + this.direction);
    }
    if(this.direction == "left") {
      this.x-= this.speed;
 //     console.log("changed succed");
 //     console.log("this.direction" + this.direction);
    }
    if(this.direction == "up") {
      this.y-= this.speed;
 //     console.log("changed succed");
 //     console.log("this.direction" + this.direction);
    }
    if(this.direction == "down") {
      this.y+= this.speed;
 //     console.log("changed succed");
 //     console.log("this.direction" + this.direction);
    }
    return false;
    }
};

Ghost.prototype.changeDirection = function (key) {
  console.log("key == "+ key);
  if(key == "37"){
    this.direction = "left";
  }
  else if(key == "38"){
    this.direction = "up";
  }
  else if(key == "39"){
    this.direction = "right";
  }
  else if(key == "40"){
    this.direction = "down";
  }
};

module.exports = Ghost;