function drawGrid(dots) {
  var cnv = document.getElementById("canvas");
  var ctx = cnv.getContext('2d');
  var gridOptions = {
    minorLines: {
      color: 'white'
    },
    majorLines: {
      separation: 30,
      color: 'blue'
    }
  };

  drawDots(dots, cnv, gridOptions.majorLines);
  drawOuterWalls(cnv, gridOptions.minorLines);
  drawOuterWalls(cnv, gridOptions.majorLines);
  // drawGridLines(cnv, gridOptions.majorLines);
}

function drawGameStatus(message, ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.font = "30px Georgia";
  ctx.fillStyle = 'white';
  ctx.fillText(message, 140, width / 2);
}

function drawDots(dots, cnv, lineOptions) {
  var iWidth = cnv.width;
  var iHeight = cnv.height;
  var iCount = null;
  var ctx = cnv.getContext('2d');
  var i;
  var j;
  var x;
  var y;
  var smallSquare = 0.5;
  iCount = Math.floor(iWidth / lineOptions.separation);
  ctx.fillStyle = 'orange';
  for (i = 0; i < dots.length; i++) {
    ctx.fillRect(dots[i].x - 3, dots[i].y - 3, 8, 8)
  }
  var Nest = {
    x: 390,
    y: 390,
    width: 120,
    height: 150
  };
  var Door = {
    x: 510,
    y: 450,
    width: 30,
    height: 30
  };
  ctx.fillStyle = 'black';
  ctx.fillRect(Nest.x, Nest.y, Nest.width, Nest.height);
  ctx.fillRect(Door.x, Door.y, Door.width, Door.height);
}

function drawOuterWalls(cnv, lineOptions) {
  var ctx = cnv.getContext('2d');
  ctx.strokeStyle = lineOptions.color;
  ctx.strokeWidth = 1;
  ctx.fillStyle = 'blue';

  ctx.beginPath();
  ctx.fill();

  var walls = Object.keys(Maze);
  walls.map(function(wall) {
    ctx.fillRect(Maze[wall].x, Maze[wall].y, Maze[wall].width, Maze[wall].height)
  });
  ctx.closePath();
  return;
}

function drawGridLines(cnv, lineOptions) {

  var iWidth = cnv.width;
  var iHeight = cnv.height;

  var ctx = cnv.getContext('2d');

  ctx.strokeStyle = lineOptions.color;
  ctx.strokeWidth = 1;
  ctx.beginPath();
  var iCount = null;
  var i = null;
  var x = null;
  var y = null;
  iCount = Math.floor(iWidth / lineOptions.separation);
  for (i = 1; i <= iCount; i++) {
    x = (i * lineOptions.separation);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, iHeight);
    ctx.stroke();
  }


  iCount = Math.floor(iHeight / lineOptions.separation);

  for (i = 1; i <= iCount; i++) {
    y = (i * lineOptions.separation);
    ctx.moveTo(0, y);
    ctx.lineTo(iWidth, y);
    ctx.stroke();
  }

  ctx.closePath();

  return;
}