/*
 * Ghost.js - The parent class of pacman ghost
 * Starting coordinate: {x: 11, y: 13} - {x: 16, y: 15}
 */

class Ghost{
  constructor(start_pos, my_name, my_speed){
    this.position = {x: start_pos.x, y: start_pos.y};
    this.meshName = my_name;
    this.moveSpeed = my_speed;
    this.objectModel = null;

    /* Set the default starting direction. Make it random to make the game interesting */
    this.direction = Math.round((Math.random() * 10) % 4); // Player move direction (0: up, 1: left, 2: down, 3: right)
    this.disabled = false;
    this.disabled_timer = 1000;
    this.scaredModel = null;
    this.path_to_follow = [];
    this.path_scared = [];
  }
}

Ghost.prototype.moveTo = function (new_coordinate) {
  /*
   * moveTo({float x, float y})
   * This function will move the ghost to the new cooridinate. Make sure the
   * passed coordinate is relative to the array coordinate.
   */

  // if(typeof new_coordinate !== 'object' || !new_coordinate) // Check if a coordinate is passed as an argument
  // console.error('Ghost.moveTo expects a coordinate object as argument 1');

  // if(!new_coordinate.x || !new_coordinate.y) // Check if an X and Y variable exist inside the coordinate object
  // console.error('Ghost.moveTo expecets an X and Y variable inside the coordinate object');

  // if(Math.abs(new_coordinate.x - this.position.x) >= 1 || Math.abs(new_coordinate.y - this.position.y) >= 1) // Check if the distance between the current position and the new position is 1 array units away
  // console.error('Ghost.moveTo can only check coordinate that is 1 array units away. Given: {x: '+new_coordinate.x+', y: '+new_coordinate.y+'}');

  /* Find the direction to reach the new coordinate */
  if(new_coordinate){
    if(new_coordinate.y == this.position.y){ // In the same Y axis (only left or right)
      this.direction = (new_coordinate.x > this.position.x ? 3 : 1); // If the new X coordinate is bigger then the current X coordinate, move to the right; else move to the left
    }else{ // In the same X axis (only up or down)
      this.direction = (new_coordinate.y > this.position.y ? 2 : 0); // If the new Y coordinate is bigger the current Y cooridinate, move down; else move up
    }
  }
};

Ghost.prototype.awake = function () { // Will be executed before start function
  var that = this;
  setTimeout(function(){
    var loader = new BABYLON.AssetsManager(scene);
    var scaredGhost = loader.addMeshTask(this.meshName+"_scared", "", "include/models/", "ghost-scared.obj");
    loader.load();
    setTimeout(function(){
      that.scaredModel = scaredGhost;
      // console.log(that.scaredModel);
    },50);
  }, 2000);
};

Ghost.prototype.start = function () {
  // This function will be executed once the object is created
};

Ghost.prototype.update = function () {
  // This function will be executed every frame
};

Ghost.prototype.move = function () {
  /*
   * Ghost move function. Same as the player move function.
   */
  switch (this.direction) {
    case 0:
      this.position.y = this.checkSquare().y; // Move the player to the new position
      scene.getMeshByName(this.meshName).position.z = this.position.x - size.x / 2; // Convert array coordinate to world coordinate

      if(Game.map[this.position.y - 1][this.position.x] && !Game.map[this.position.y - 1][this.position.x].collide) // Check if the next movement will lead to a wall
      scene.getMeshByName(this.meshName).position.x -= this.moveSpeed; // Move the character if doing so will not lead to a wall (this move goes up)
      break;
    case 1:
      this.position.x = this.checkSquare().x;
      scene.getMeshByName(this.meshName).position.x = this.position.y - size.y / 2;

      if(Game.map[this.position.y][this.position.x - 1] && !Game.map[this.position.y][this.position.x - 1].collide)
      scene.getMeshByName(this.meshName).position.z -= this.moveSpeed; // Left
      break;

    case 2:
      this.position.y = this.checkSquare().y;
      scene.getMeshByName(this.meshName).position.z = this.position.x - size.x / 2;

      if(Game.map[this.position.y + 1][this.position.x] && !Game.map[this.position.y + 1][this.position.x].collide && !Game.map[this.position.y + 1][this.position.x].upOnly)
      scene.getMeshByName(this.meshName).position.x += this.moveSpeed; // down
      break;

    case 3:
      this.position.x = this.checkSquare().x;
      scene.getMeshByName(this.meshName).position.x = this.position.y - size.y / 2;

      if(Game.map[this.position.y][this.position.x + 1] && !Game.map[this.position.y][this.position.x + 1].collide)
      scene.getMeshByName(this.meshName).position.z += this.moveSpeed; // Right
      break;
    default:

  }
};

Ghost.prototype.checkSquare = function () {
  /*
   * Ghost checkSquare function. Same as player's checkSquare
   */
  // Make cache for the player's position
  var tmp_y = scene.getMeshByName(this.meshName).position.x;
  var tmp_x = scene.getMeshByName(this.meshName).position.z;

  if(this.direction === 2){ // Down
    // Ceil the rounding
    tmp_y = Math.floor(scene.getMeshByName(this.meshName).position.x - 0.1) + (size.y / 2)
  }else if(this.direction === 0){ // Up
    // Floor the rounding
    tmp_y = Math.ceil(scene.getMeshByName(this.meshName).position.x + 0.1) + (size.y / 2)
  }else{
    tmp_y = this.position.y;
  }

  if(this.direction === 3){ // Right
    // Ceil the rounding
    tmp_x = Math.floor(scene.getMeshByName(this.meshName).position.z + 0.1) + (size.x / 2)
  }else if(this.direction === 1){ // Left
    // Floor the rounding
    tmp_x = Math.ceil(scene.getMeshByName(this.meshName).position.z - 0.1) + (size.x / 2)
  }else{
    tmp_x = this.position.x;
  }

  return {'x': tmp_x, 'y': tmp_y, raw: {'x': tmp_x, 'y': tmp_y}};
};

Ghost.prototype.onEatenByPlayer = function (callback) {
  for(var i = 0; i < EntityManager.entityList.length; i++){
    if(game_start && Game.powerPellet_effect){
      if(EntityManager.entityList[i].tagName != 'player')
        continue;

      if(EntityManager.entityList[i].position.x == this.position.x && EntityManager.entityList[i].position.y == this.position.y){
        EntityManager.getEntity('player').score += 20;
        EntityManager.getEntity('player').eaten_ghost_count++;

        if (typeof callback == 'function')
        callback();

        return true;
      }
    }
  }

  return false;
};

Ghost.prototype.moveToSpawn = function () {
  this.position = {x: Math.floor(Math.random() * 5) + 11,
                   y: Math.floor(Math.random() * 2) + 13};

  scene.getMeshByName(this.meshName).position.z = this.position.x - size.x / 2;
  scene.getMeshByName(this.meshName).position.x = this.position.y - size.y / 2;
};

Ghost.prototype.scared = function () {
  /*
   * When the ghost is scared, it should move to a random location on the map.
   * Once the power pellet effect wore off, it should continue doing what its
   * doing before it got scared
   */

  this.objectModel.loadedMeshes[0].visibility = 0; // Hide the default model
  this.scaredModel.loadedMeshes[0].visibility = 1; // Show the scared model
  this.scaredModel.loadedMeshes[0].position = scene.getMeshByName(this.meshName).position; // Set the model position with the placeholder's position

  if(this.direction == 1)
  this.objectModel.loadedMeshes[0].rotation.y = 0; // Look left when the direction is 1 (left)

  if(this.direction == 3)
  this.objectModel.loadedMeshes[0].rotation.y = 179; // Look right when the direction is 3 (right)

  if(this.direction == 0)
  this.objectModel.loadedMeshes[0].rotation.y = 89.5; // Look up when the direction is 0 (up)

  if(this.direction == 2)
  this.objectModel.loadedMeshes[0].rotation.y = 180.5; // Look down when the direction is 2 (down)

  /*
  * To get a random behaviour in the blue ghost, select a random point in the
  * map and follow the path excatly to that spot. Once the spot has been
  * reached, randomize another point.
  */

  if(this.path_scared.length <= 2)
  this.getRandomLocation();

  // console.log(this.path_scared);

  this.moveTo(this.path_scared[1]);
  this.move();

  /* Remove the current node when the ghost has arived to the current node */
  if(this.path_scared[1] && this.position){
   if(this.position.x == this.path_scared[1].x && this.position.y == this.path_scared[1].y){
     this.path_scared.splice(1,1);
   }
  }
};

Ghost.prototype.getRandomLocation = function () {
  var start_node = new Node(this.position, 0, 0);        // Set the starting node as the ghost's position
  var random_end = {x: Math.round(Math.random() * 100) % Game.map[0].length, y: Math.round(Math.random() * 100) % Game.map.length};

  var end_node = new Node(random_end, 0, 0); // Set the ending node to the player's position
  as = new AStar(start_node, end_node);                  // Create new instance of the algorithm
  var paths = as.solve(false, function(loc){             // Call solver function
    /*
     * The valid move checker function. This function will be used by the
     * algorithm to determine if the next node is a valid node.
     */

   if(loc.x < 0 || loc.x >= Game.map[0].length || loc.y < 0 || loc.y >= Game.map.length) // Check if the current node is in the map
   return false;

   if(Game.map[loc.y][loc.x].collide) // Check if the current node is a wall
   return false;

   return true;
  });

  for(var i = 0; i < paths.length; i++){
    if((paths[i].x >= 11 && paths[i].x <= 16) && (paths[i].y >= 13 && paths[i].y <= 15)){
      if(paths[i].x == 14 && (paths[i].y >= 12 && paths[i].y <= 14)){
        paths.splice(paths.length - 1, 1)// Pop the path to prevent stucking
      }
    }
  }

  this.path_scared = paths; // Save the paths
};
