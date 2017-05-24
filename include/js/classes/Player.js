class Player{
  constructor(){
    this.position = {'x': 13, 'y': 23};     // PLayer position in world coordinate
    this.direction = 1;                   // Player move direction (0: up, 1: left, 2: down, 3: right)
    this.playerMod = null;
    this.moveSpeed = 0.09;
    this.allow_move = true;
    this.has_teleport = false;
    this.last_position = {'x': 0, 'y': 0};
  }
}

Player.prototype.start = function () {
  setTimeout(function(){
    var faceColors = new Array(6);
    for(var i = 0; i < 6; i++)
      faceColors[i] = new BABYLON.Color4(1,1,0,1);   // yellow

    var options = {
      width: 0.8,
      height: 0.8,
      depth: 0.8,
      faceColors : faceColors
    };

    this.playerMod = BABYLON.MeshBuilder.CreateBox('playerModel', options, scene);
    this.playerMod.checkCollisions = true
    this.playerMod.position.z = 13 - size.x / 2;
    this.playerMod.position.x = 23 - size.y / 2;
    this.playerMod.position.y = 0;

    this.playerMod = scene.getMeshByName('playerModel');
  },2000);
};

Player.prototype.update = function () {
  1

  /* Basic input script (rather shit) */
  var that = this;
  window.addEventListener('keydown', function(e){
    if(e.keyCode === 87){  // W
      if(Game.map[that.position.y - 1][that.position.x] && !Game.map[that.position.y - 1][that.position.x].collide){
        that.direction = 0;
      }
    }

    if(e.keyCode === 65){  // A
      if(Game.map[that.position.y][that.position.x - 1] && !Game.map[that.position.y][that.position.x - 1].collide){
        that.direction = 1;
      }
    }

    if(e.keyCode === 83){  // S
      if(Game.map[that.position.y + 1][that.position.x] && !Game.map[that.position.y + 1][that.position.x].collide && !Game.map[that.position.y + 1][that.position.x].upOnly){
        that.direction = 2;
      }
    }

    if(e.keyCode === 68){ // D
      if(Game.map[that.position.y][that.position.x + 1] && !Game.map[that.position.y][that.position.x + 1].collide){
        that.direction = 3;
      }
    }
  });

  /* Basic movement script (rather shit) */
  if(scene.getMeshByName('playerModel') && this.allow_move){
    switch (this.direction) {
      case 0:
        this.position.y = this.checkSquare().y;
        scene.getMeshByName('playerModel').position.z = this.position.x - size.x / 2;

        if(Game.map[this.position.y - 1][this.position.x] && !Game.map[this.position.y - 1][this.position.x].collide)
        scene.getMeshByName('playerModel').position.x -= this.moveSpeed; // up
        break;
      case 1:
        this.position.x = this.checkSquare().x;
        scene.getMeshByName('playerModel').position.x = this.position.y - size.y / 2;

        if(Game.map[this.position.y][this.position.x - 1] && !Game.map[this.position.y][this.position.x - 1].collide)
        scene.getMeshByName('playerModel').position.z -= this.moveSpeed; // Left
        break;

      case 2:
        this.position.y = this.checkSquare().y;
        scene.getMeshByName('playerModel').position.z = this.position.x - size.x / 2;

        if(Game.map[this.position.y + 1][this.position.x] && !Game.map[this.position.y + 1][this.position.x].collide && !Game.map[this.position.y + 1][this.position.x].upOnly)
        scene.getMeshByName('playerModel').position.x += this.moveSpeed; // down
        break;

      case 3:
        this.position.x = this.checkSquare().x;
        scene.getMeshByName('playerModel').position.x = this.position.y - size.y / 2;

        if(Game.map[this.position.y][this.position.x + 1] && !Game.map[this.position.y][this.position.x + 1].collide)
        scene.getMeshByName('playerModel').position.z += this.moveSpeed; // Right
        break;
      default:

    }
  }

  /* Teleportation */
  if(Game.map[this.position.y][this.position.x] && Game.map[this.position.y][this.position.x].warp && !this.has_teleport){
    // Check if player is in the left or right teleporter.
    // If player is on the left, move the player to the right and vice versa

    this.position.x = (this.position.x == 0 ? 27 : 0); // Player position in array

    // Player position in world coordinate
    var worldPos = Math.round(scene.getMeshByName('playerModel').position.z);
    scene.getMeshByName('playerModel').position.z = (worldPos == -14 ? 13 : -14);

    // Prevent infinite teleportation by giving slight delay after each teleport
    this.has_teleport = true;
    setTimeout(function(){
      console.log('teleport available');
      that.has_teleport = false;
    }, 800);
  }
};

Player.prototype.checkSquare = function () {
  // Make cache for the player's position
  var tmp_y = scene.getMeshByName('playerModel').position.x;
  var tmp_x = scene.getMeshByName('playerModel').position.z;

  if(this.direction === 2){ // Down
    // Ceil the rounding
    tmp_y = Math.floor(scene.getMeshByName('playerModel').position.x - 0.1) + (size.y / 2)
  }else if(this.direction === 0){ // Up
    // Floor the rounding
    tmp_y = Math.ceil(scene.getMeshByName('playerModel').position.x + 0.1) + (size.y / 2)
  }else{
    tmp_y = this.position.y;
  }

  if(this.direction === 3){ // Right
    // Ceil the rounding
    tmp_x = Math.floor(scene.getMeshByName('playerModel').position.z + 0.1) + (size.x / 2)
  }else if(this.direction === 1){ // Left
    // Floor the rounding
    tmp_x = Math.ceil(scene.getMeshByName('playerModel').position.z - 0.1) + (size.x / 2)
  }else{
    tmp_x = this.position.x;
  }

  return {'x': tmp_x, 'y': tmp_y, raw: {'x': tmp_x, 'y': tmp_y}};
};

Player.prototype.find_collision = function () {
  var corners = {
    'top':{
      'left': false,
      'right': false
    },
    'bottom':{
      'left': false,
      'right': false
    }


  };
};
