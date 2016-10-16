function Ghost(id) {
  this.speed = 5;
  this.id = id;
}

Ghost.prototype.render = function (status, ctx) {
  this.placeGhost(status, ctx);
};

Ghost.prototype.placeGhost = function (status, ctx) {
  var img = new Image();
  img.src = status.src;
  img.onload = function () {
    ctx.drawImage(img, status.x - 10, status.y - 10, status.width, status.height);
  };
};