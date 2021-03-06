class RedGhost extends Ghost {
  constructor(){
    super({x: 11, y: 11}, 'redGhostModel', 0.07);

    this.start_pos = {x: 13, y: 11};
    this.my_model = null;
  }
}

RedGhost.prototype.start = function () { // Overwrite the parent's start function
  var that = this;
  setTimeout(function(){
    var faceColors = new Array(6);
    for(var i = 0; i < 6; i++)
      faceColors[i] = new BABYLON.Color4(1,0,0,0);   // red

    var options = {
      width: 0.01,
      height: 0.01,
      depth: 0.01,
      faceColors : faceColors
    };

    var playerMod = BABYLON.MeshBuilder.CreateBox('redGhostModel', options, scene);
    playerMod.checkCollisions = true

    playerMod.position.z = that.start_pos.x - size.x / 2;
    playerMod.position.x = that.start_pos.y - size.y / 2;
    playerMod.position.y = 0;

    that.my_model = scene.getMeshByName('redGhostModel');
    this.playerMod = scene.getMeshByName('playerModel');
    var loader = new BABYLON.AssetsManager(scene);
    var redGhost = loader.addMeshTask("redGhost", "", "include/models/", "ghost-red.obj");
    loader.load();
    setTimeout(function(){
      that.objectModel = redGhost;
    },50);
  },2000);
};

RedGhost.prototype.update = function () { // Overwrite the parent's update function
  if(!this.disabled && !Game.powerPellet_effect){
    this.scaredModel.loadedMeshes[0].visibility = 0; // Hide the scared model
    this.objectModel.loadedMeshes[0].visibility = 1; // Show the default model
    this.objectModel.loadedMeshes[0].position = scene.getMeshByName('redGhostModel').position; // Set the model position with the placeholder's position
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

    if(this.direction == 1)
    this.objectModel.loadedMeshes[0].rotation.y = 0; // Look left when the direction is 1 (left)

    if(this.direction == 3)
    this.objectModel.loadedMeshes[0].rotation.y = 179; // Look right when the direction is 3 (right)

    if(this.direction == 0)
    this.objectModel.loadedMeshes[0].rotation.y = 89.5; // Look up when the direction is 0 (up)

    if(this.direction == 2)
    this.objectModel.loadedMeshes[0].rotation.y = 180.5; // Look down when the direction is 2 (down)

    this.moveTo(paths[1]);
    // console.log(this.position, paths[0], paths[1]);
    this.move();
  }

  if(Game.powerPellet_effect){ // If power pellet is at effect
    this.scaredModel.loadedMeshes[0].visibility = 0; // Hide the scared model
    this.scared();
  }

  /*
   * Check if the current NPC has been eaten by the player. Once the ghost is
   * eaten by the player, the ghost will teleport back to spaw then wait for 1
   * second before chasing the player
   */
  var that = this; // Reference the current object so that we can set a timer
  this.onEatenByPlayer(function(){ // The function that checks when the ghost is eaten
    that.moveToSpawn(); // Teleport to spawn
    that.disabled = true; // Disable the AI
    setTimeout(function(){ // Wait before executing the function
      that.disabled = false; // Re-enable AI
    }, that.disabled_timer);
  });
};
