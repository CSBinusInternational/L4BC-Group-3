require(['include/js/classes/Player.js']);
var Game = {
  powerPellet_effect: false,
  powerPellet_duration: 8000,
  activatePowerPellet: function(){
    Game.powerPellet_effect = true;

    setTimeout(function(){
      Game.powerPellet_effect = false;
    }, Game.powerPellet_duration);
  }
};
Game.map = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
  [0,3,0,1,1,0,2,0,1,1,1,0,2,0,0,2,0,1,1,1,0,2,0,1,1,0,3,0],
  [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
  [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
  [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
  [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
  [1,1,1,1,1,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,1,1,1,1,1],
  [1,1,1,1,1,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,1,1,1,1,1],
  [1,1,1,1,1,0,2,0,0,1,0,0,0,4,4,0,0,0,1,0,0,2,0,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,1,0,1,1,1,1,1,1,0,1,0,0,2,0,0,0,0,0,0],
  [9,1,1,1,1,1,2,1,1,1,0,1,1,1,1,1,1,0,1,1,1,2,1,1,1,1,1,9],
  [0,0,0,0,0,0,2,0,0,1,0,1,1,1,1,1,1,0,1,0,0,2,0,0,0,0,0,0],
  [1,1,1,1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,1,1,1,1,1],
  [1,1,1,1,1,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,1,1,1,1,1],
  [1,1,1,1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
  [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
  [0,3,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,3,0],
  [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
  [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
  [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
  [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
  [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

/* Map legend */
/* 0 - Wall (collide)
 * 1 - empty
 * 2 - Food
 * 3 - power pellet
 * 4 - One way door (up only)
 * 9 - warp
 */

function processMap(){
  var size = {x: Game.map[0].length, y: Game.map.length};
  for(var y = 0; y < size.y; y++){
    for(var x = 0; x < size.x; x++){
      var mapType = Game.map[y][x];
      Game.map[y][x] = {
        collide    : (mapType == 0),
        isFood     : (mapType == 2 || mapType == 3),
        hasFood    : (mapType == 2 || mapType == 3),
        powerPellet: (mapType == 3),
        upOnly     : (mapType == 4),
        warp       : (mapType == 9)
      };
    }
  }
}

function resetMap(){
  // var foodCount = 0;
  var size = {x: Game.map[0].length, y: Game.map.length};
  for(var y = 0; y < size.y; y++){
    for(var x = 0; x < size.x; x++){
      var currentTile = Game.map[y][x];
      currentTile.hasFood = currentTile.isFood;

      // if(currentTile.isFood)
        // foodCount++;
    }
  }
  // return foodCount;
}

processMap();

setTimeout(function(){
  EntityManager.pushEntity(new Player(), 'player');
  EntityManager.pushEntity(new RedGhost(), 'redGhost');
  EntityManager.pushEntity(new OrangeGhost(), 'orangeGhost');
  EntityManager.pushEntity(new PinkGhost(), 'pinkGhost');
  EntityManager.pushEntity(new BlueGhost(), 'blueGhost');
}, 1000);
