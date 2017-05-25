class Player{
  constructor(){
    this.position = {'x': 13, 'y': 23};   // PLayer position in world coordinate
    this.direction = 1;                   // Player move direction (0: up, 1: left, 2: down, 3: right)
    this.playerMod = null;                // Temporary variable
    this.moveSpeed = 0.09;                // Set how much units will the player be moved every frame
    this.allow_move = true;               // Valid or invalid move
    this.has_teleport = false;
    this.score = 0;                       // Track the player's score
  }
}

Player.prototype.start = function () {
  var that = this;
  setTimeout(function(){
    var faceColors = new Array(6);
    for(var i = 0; i < 6; i++)
      faceColors[i] = new BABYLON.Color4(1,1,0,1);   // yellow

    var options = {
      width: 0.01,
      height: 0.01,
      depth: 0.01,
      faceColors : faceColors
    };

    this.playerMod = BABYLON.MeshBuilder.CreateBox('playerModel', options, scene);
    this.playerMod.checkCollisions = true
    this.playerMod.position.z = 13 - size.x / 2;
    this.playerMod.position.x = 23 - size.y / 2;
    this.playerMod.position.y = 0;

    this.playerMod = scene.getMeshByName('playerModel');
    var loader = new BABYLON.AssetsManager(scene);
    var pacman = loader.addMeshTask("pacman", "", "include/models/", "pacman.obj");
    loader.load();
    setTimeout(function(){
      that.playerMod = pacman;
    },50)
  },2000);
};

Player.prototype.update = function () {
  this.playerMod.loadedMeshes[1].position = scene.getMeshByName('playerModel').position; // Set the model position with the placeholder's position
  for(var i = 0; i < EntityManager.entityList.length; i++){
    if(game_start){
      if(EntityManager.entityList[i].tagName == this.tagName)
        continue;

      if(EntityManager.entityList[i].position.x == this.position.x && EntityManager.entityList[i].position.y == this.position.y){
        game_start = false;
        this.position = EntityManager.entityList[i].position;
        alert('You died!');
      }
    }
  }

  /* Basic input script */
  var that = this;
  window.addEventListener('keydown', function(e){
    /*
     * Read what key the user is pressing. Respond to the key pressed
     * accordingly. This key press will only give the player script instruction
     * which direction to move. The actual movement script is bellow this
     * detection function.
     *
     * In each if statement, the game checks if the new target position empty
     * (no wall). If the position is empty, change the direction of the player.
     * The direction ID is as follow:
     *
     * 0: Up
     * 1: Left
     * 2: Down
     * 3: Right
     *
     */
    if(e.keyCode === 87){  // W is down
      if(Game.map[that.position.y - 1][that.position.x] && !Game.map[that.position.y - 1][that.position.x].collide){ // Check collision
        that.direction = 0; // Change the direction ID
      }
    }

    if(e.keyCode === 65){  // A is down
      if(Game.map[that.position.y][that.position.x - 1] && !Game.map[that.position.y][that.position.x - 1].collide){
        that.direction = 1;
      }
    }

    if(e.keyCode === 83){  // S is down
      if(Game.map[that.position.y + 1][that.position.x] && !Game.map[that.position.y + 1][that.position.x].collide && !Game.map[that.position.y + 1][that.position.x].upOnly){
        that.direction = 2;
      }
    }

    if(e.keyCode === 68){ // D is down
      if(Game.map[that.position.y][that.position.x + 1] && !Game.map[that.position.y][that.position.x + 1].collide){
        that.direction = 3;
      }
    }
  });

  if(scene.getMeshByName('playerModel') && this.allow_move){
    /*
     * Move the player according to the move ID. The switch statement will check
     * the current move ID and will execute the corresponding case statement.
     * Each case statement works as follow:
     *
     * First, the logic will check if there is a wall in front of the player.
     * If no wall is found, the game will move the player this.moveSpeed in the
     * (x/z) direction. The positive and negative value can be figured out as
     * as follow: Down/ Right (positive), Up/ Left (Negative).
     *
     * We decrease the position to go up because the origin of the grid is in
     * the top left corner of the screen/ array.
     *
     * The variable this.moveSpeed is the amount of unit the player should be
     * moved every frame. The direction (x/y) is founded by trial and error.
     * The X axis will move the player forward and backward while the Z axis
     * will move the player to the left and right.
     */
    switch (this.direction) {
      case 0:
        this.position.y = this.checkSquare().y; // Move the player to the new position
        scene.getMeshByName('playerModel').position.z = this.position.x - size.x / 2; // Convert array coordinate to world coordinate

        if(Game.map[this.position.y - 1][this.position.x] && !Game.map[this.position.y - 1][this.position.x].collide) // Check if the next movement will lead to a wall
        scene.getMeshByName('playerModel').position.x -= this.moveSpeed; // Move the character if doing so will not lead to a wall (this move goes up)
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

    // Eat the food pellet
    if(Game.map[this.position.y][this.position.x].hasFood){
      this.score++; // Increment player's score
      Game.map[this.position.y][this.position.x].hasFood = 0; // Remove the reference in the world map
      scene.getMeshByName("pellet"+(Game.map[0].length * this.position.x + this.position.y)).dispose(); // Remove the pellet reference from the game
      document.getElementById('player-score').innerText = this.score; // Update UI score
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
  /*
   * This function will convert the world coordinate to the array coordinate.
   * It works by rounding up or down the current world coordinate and adding or
   * subtracting the player world position with the offset of the size of the
   * player (from default size (1). This case, the player size is 0.8.
   * 1 - 0.8 = 0.2. 0.2 / 2 = 0.1. That is how I came up with 0.1). Then we add
   * up with the size of the world map.
   */
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

// Player.prototype.find_collision = function () { <-- Someone was drunk coding... Function unused
//   var corners = {
//     'top':{
//       'left': false,
//       'right': false
//     },
//     'bottom':{
//       'left': false,
//       'right': false
//     }
//
//
//   };
// };
