var Map = [
  '##############################',
  '#............................#',
  '#.####.######.##.######.####.#',
  '#.#.........#.#..#.........#.#',
  '#.#.#.#.###.#.##.#.#####.#.#.#',
  '#...#.#.#.#.#..#.#.#.....#...#',
  '###.#.###.#.#.##.#.#.###.#.###',
  '#...#.......#.#..#.#.#.#.#...#',
  '#.###.#####.#.##.#.###.#.#.#.#',
  '#...#.#...#....#.......#.#.#.#',
  '#.#.#.#.#.#.######.#.#.#.#.#.#',
  '#.#.#.#.#.#........#.#.#.#.#.#',
  '#.#.#.#.#.#.######.#.#...#.#.#',
  '#.#.#.#.#.#.#....#.#.#.#.#.#.#',
  '#.#.....#.#.#....#...#.#...#.#',
  '#.#####.#.#.#......###.#####.#',
  '#.#.....#.#.#....#...#.....#.#',
  '#.#.#####.#.#....#.#.#####.#.#',
  '#.#.........######.#.......#.#',
  '#.#.#.#####........#########.#',
  '#...#.......#.##.#.......#...#',
  '#.#.#######.#..#.#.#######.#.#',
  '#.#.#.......#.##.#.......#.#.#',
  '#.#.#.###.#.#.#..#.#.###.#.#.#',
  '#.#.#.#...#.#.##.#.#.#...#.#.#',
  '#.#.#.###.#.#..#.#.#.###.#.#.#',
  '#.#.......#.#.##.#.#.......#.#',
  '#.#########.#.##.#.#########.#',
  '#............................#',
  '##############################'
];

var Maze = {
  topWall: {
    x: 0,
    y: 0,
    width: 900,
    height: 30
  },

  leftWall: {
    x: 0,
    y: 30,
    width: 30,
    height: 840
  },

  rightWall: {
    x: 870,
    y: 30,
    width: 30,
    height: 840
  },

  bottomWall: {
    x: 0,
    y: 870,
    width: 900,
    height: 30
  }
};

// var map = [];
// for (var row = 0; row < 30; row++) {
//   var cols = '';
//   for (var col = 0; col < 30; col++) {
//     cols += '.';
//   }
//   map.push(cols);
// }
// change maze to map
// for( var i = 0;  i < 30; i ++) {
//   map[i] = map[i].replaceAt(0, '#');
//   map[i] = map[i].replaceAt(29, '#');
//   map[0] = map[0].replaceAt(i, '#');
//   map[29] = map[29].replaceAt(i, '#');
// }
//
// for (var idx = 1; idx < 78; idx++) {
//   var wall = Maze['wall' + idx];
//   wall.x /= 30; //2
//   wall.y /= 30; //2
//   wall.width /= 30; //4
//   wall.height /= 30; //1
//
//   for (i = 0; i < wall.width; i++) {
//     map[wall.y] = map[wall.y].replaceAt(wall.x + i, '#');
//   }
//
//   for (var j = 0; j < wall.height; j++) {
//     map[wall.y + j] = map[wall.y + j].replaceAt(wall.x, '#');
//   }
// }
// console.log(map);

//change map to maze
var height = Map.length;
var width = Map[0].length;

var count = 0;
for(var i = 0; i < height; i ++) {
  for ( var j = 0; j < width; j ++) {
    var wall = {};
    if(Map[i][j] == '#') {
      wall.x = i;
      wall.y = i;
      //calculate width and height
      Maze['wall' + (count++)] = {
        x: j * 30,
        y: i * 30,
        width: 30,
        height: 30
      }
    }
  }
}

if (typeof module !== 'undefined' && 'exports' in module) {
  module.exports = Maze;
}
