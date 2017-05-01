class Player{
  constructor(){
    this.position = {'x': 13, 'y': 23};     // PLayer position in world coordinate
    this.direction = 1;                   // Player move direction (0: up, 1: left, 2: down, 3: right)
    this.playerMod = null;
    this.moveSpeed = 0.038;
    this.allow_move = true;
    this.has_teleport = false;
  }
}

Player.prototype.start = function () {
  setTimeout(function(){
    var faceColors = new Array(6);
    for(var i = 0; i < 6; i++)
      faceColors[i] = new BABYLON.Color4(1,1,0,1);   // yellow

    var options = {
      width: 1,
      height: 1,
      depth: 1,
      faceColors : faceColors
    };

    this.playerMod = BABYLON.MeshBuilder.CreateBox('playerModel', options, scene);
    this.playerMod.position.z = 13 - size.x / 2;
    this.playerMod.position.x = 23 - size.y / 2;
    this.playerMod.position.y = 0;

    this.playerMod = scene.getMeshByName('playerModel');
  },2000);
};

Player.prototype.update = function () {
  /* Basic input script (rather shit) */
  var that = this;
  window.addEventListener('keydown', function(e){
    if(e.keyCode === 87){
      if(Game.map[that.position.y - 1][that.position.x] && !Game.map[that.position.y - 1][that.position.x].collide)
      that.direction = 0;
    }

    if(e.keyCode === 65){
      if(Game.map[that.position.y][that.position.x - 1] && !Game.map[that.position.y][that.position.x - 1].collide)
      that.direction = 1;
    }

    if(e.keyCode === 83){
      if(Game.map[that.position.y + 1][that.position.x] && !Game.map[that.position.y + 1][that.position.x].collide)
      that.direction = 2;
    }

    if(e.keyCode === 68){
      if(Game.map[that.position.y][that.position.x + 1] && !Game.map[that.position.y][that.position.x + 1].collide)
      that.direction = 3;
    }
  });

  /* Basic movement script (rather shit) */
  if(scene.getMeshByName('playerModel')){
    switch (this.direction) {
      case 0:
        this.position.y = Math.ceil(scene.getMeshByName('playerModel').position.x) + (size.y / 2) - 0.5;
        scene.getMeshByName('playerModel').position.z = this.position.x - size.x / 2;

        if(Game.map[this.position.y - 1][this.position.x] && !Game.map[this.position.y - 1][this.position.x].collide)
        scene.getMeshByName('playerModel').position.x -= this.moveSpeed; // up
        break;
      case 1:
        this.position.x = Math.ceil(scene.getMeshByName('playerModel').position.z) + (size.x / 2);
        scene.getMeshByName('playerModel').position.x = this.position.y - size.y / 2;

        if(Game.map[this.position.y][this.position.x - 1] && !Game.map[this.position.y][this.position.x - 1].collide)
        scene.getMeshByName('playerModel').position.z -= this.moveSpeed; // Left
        break;

      case 2:
        this.position.y = Math.floor(scene.getMeshByName('playerModel').position.x) + (size.y / 2) - 0.5;
        scene.getMeshByName('playerModel').position.z = this.position.x - size.x / 2;

        if(Game.map[this.position.y + 1][this.position.x] && !Game.map[this.position.y + 1][this.position.x].collide)
        scene.getMeshByName('playerModel').position.x += this.moveSpeed; // down
        break;

      case 3:
        this.position.x = Math.floor(scene.getMeshByName('playerModel').position.z) + (size.x / 2);
        scene.getMeshByName('playerModel').position.x = this.position.y - size.y / 2;

        if(Game.map[this.position.y][this.position.x + 1] && !Game.map[this.position.y][this.position.x + 1].collide)
        scene.getMeshByName('playerModel').position.z += this.moveSpeed; // Right
        break;
      default:

    }
  }

  /* Teleportation */
  if(Game.map[this.position.y][this.position.x] && Game.map[this.position.y][this.position.x].warp && !this.has_teleport){
    this.position.x = (this.position.x == 0 ? 27 : 0);

    var worldPos = Math.round(scene.getMeshByName('playerModel').position.z);
    scene.getMeshByName('playerModel').position.z = (worldPos == -14 ? 13 : -14);

    this.has_teleport = true;
    console.log('teleported');
    setTimeout(function(){
      console.log('teleport available');
      that.has_teleport = false;
    }, 800);
  }
};
