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
      faceColors[i] = new BABYLON.Color4(1,0,0,1);   // red

    var options = {
      width: 0.8,
      height: 0.8,
      depth: 0.8,
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
    },50)
  },2000);
};

RedGhost.prototype.update = function () { // Overwrite the parent's update function
  this.objectModel.loadedMeshes[2].position = scene.getMeshByName('redGhostModel').position; // Set the model position with the placeholder's position
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

  this.moveTo(paths[1]);
  // console.log(this.position, paths[0], paths[1]);
  this.move();
};
