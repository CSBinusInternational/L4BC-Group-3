class OrangeGhost extends Ghost {
  constructor(){
    super({x: 11, y: 13}, 'orangeGhostModel', 0.07);

    this.start_pos = {x: 15, y: 13};
    this.my_model = null;
    this.prev_position;
    this.path_to_follow = null;
  }
}

OrangeGhost.prototype.start = function () { // Overwrite the parent's start function
  var that = this;
  setTimeout(function(){
    var faceColors = new Array(6);
    for(var i = 0; i < 6; i++)
      faceColors[i] = new BABYLON.Color4(1,0.6,0,0);   // orange

    var options = {
      width: 0.01,
      height: 0.01,
      depth: 0.01,
      faceColors : faceColors
    };

    var playerMod = BABYLON.MeshBuilder.CreateBox('orangeGhostModel', options, scene);
    playerMod.checkCollisions = true

    playerMod.position.z = that.start_pos.x - size.x / 2;
    playerMod.position.x = that.start_pos.y - size.y / 2;
    playerMod.position.y = 0;

    that.my_model = scene.getMeshByName('orangeGhostModel');
    this.playerMod = scene.getMeshByName('playerModel');
    var loader = new BABYLON.AssetsManager(scene);
    var orangeGhost = loader.addMeshTask("orangeGhost", "", "include/models/", "ghost-orange.obj");
    loader.load();
    setTimeout(function(){
      that.objectModel = orangeGhost;
    },50);
  },2000);
  this.newPath();
};

OrangeGhost.prototype.update = function () { // Overwrite the parent's update function
  this.objectModel.loadedMeshes[0].position = scene.getMeshByName('orangeGhostModel').position; // Set the model position with the placeholder's position

  if(this.direction == 1)
  this.objectModel.loadedMeshes[0].rotation.y = 0; // Look left when the direction is 1 (left)

  if(this.direction == 3)
  this.objectModel.loadedMeshes[0].rotation.y = 179; // Look right when the direction is 3 (right)

  if(this.direction == 0)
  this.objectModel.loadedMeshes[0].rotation.y = 89.5; // Look up when the direction is 0 (up)

  if(this.direction == 2)
  this.objectModel.loadedMeshes[0].rotation.y = 180.5; // Look down when the direction is 2 (down)

  /*
   * To get a random behaviour in the orange ghost, select a random point in the
   * map and follow the path excatly to that spot. Once the spot has been
   * reached, randomize another point.
   */

  if(this.path_to_follow.length == 1)
  this.newPath();

  this.moveTo(this.path_to_follow[1]);
  this.move();

  /* Remove the current node when the ghost has arived to the current node */
  if(this.path_to_follow[1] && this.position){
    if(this.position.x == this.path_to_follow[1].x && this.position.y == this.path_to_follow[1].y){
      this.path_to_follow.splice(1,1);
    }
  }
};

OrangeGhost.prototype.newPath = function () {
  /* A function to generate new sets of path nodes to follow */

  var player_object = EntityManager.getEntity("player"); // Get the player
  var start_node = new Node(this.position, 0, 0);        // Set the starting node as the ghost's position
  var end_node = new Node(player_object.position, 0, 0); // Set the ending node to the player's position
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

  this.path_to_follow = paths; // Save the paths
};
