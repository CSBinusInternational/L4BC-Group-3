require(['include/js/babylon.custom.js']);
require(['include/js/hand.min.1.3.8.js']);

require(['include/js/classes/algorithm/astar.js']);
require(['include/js/classes/EntityManager.js']);
require(['include/js/classes/game.js']);

var scene;
var as;
var keys_pressed = [];
var size;
var game_start = false;
var press_key_interval = null;

setTimeout(function(){
  var canvas = document.getElementById('defaultCanvas');
  var engine = new BABYLON.Engine(canvas);
  scene = new BABYLON.Scene(engine);

  // var light = new BABYLON.PointLight("lightName", BABYLON.Vector3.Zero(), scene);
  var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
  light0.diffuse = new BABYLON.Color3(0, 0, 0);
  light0.specular = new BABYLON.Color3(0, 0, 0);
  light0.groundColor = new BABYLON.Color3(0, 0, 0);

  var createScene = function () {

    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
    var cam = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0.6, 36, new BABYLON.Vector3(0, 0, 0), scene);
    cam.attachControl(canvas);

    var loader = new BABYLON.AssetsManager(scene);

    var position = -5;
    var pos = function(t) {
      t.loadedMeshes.forEach(function(m) {
          m.position.x -= position;
      });
      position += 5;
    };

    var wallCount = 0;
    size = {x: Game.map[0].length, y: Game.map.length};
    var faceColors = new Array(6);
    for(var i = 0; i < 6; i++)
      faceColors[i] = new BABYLON.Color4(0,0,1,1);   // blue

    var options = {
      width: 1,
      height: 1,
      depth: 1,
      faceColors : faceColors
    };

    for(var y = 0; y < size.y; y++){
      for(var x = 0; x < size.x; x++){
        var currentTile = Game.map[y][x];

        if(currentTile.collide){
          var box = BABYLON.MeshBuilder.CreateBox('box'+wallCount, options, scene);
          box.position.z = x - size.x / 2;
          box.position.x = y - size.y / 2;
          box.position.y = 0;
          wallCount++;
        }
      }
    }

    cam.position.x = -40;

    // box.position = new BABYLON.Vector3(0, 2.5, 0);

    return scene;

  };  // End of createScene function

  scene = createScene();


  /* Register a render loop to repeatedly render the scene */
  engine.runRenderLoop(function () {
    window.addEventListener("keydown",
        function(e){
            keys_pressed[e.keyCode] = true;
            checkCombinations(e);
        },
    false);

    window.addEventListener('keyup',
        function(e){
            keys_pressed[e.keyCode] = false;
        },
    false);

    function checkCombinations(e){
        if(keys_pressed["a".charCodeAt(0)] && e.ctrlKey){
            alert("You're not allowed to mark all content!");
            e.preventDefault();
        }
    }

    /*
     * Execute entity frame script if the game is started. If game is not started,
     * we want to check if the user has pressed any movement keys (WASD). If user
     * pressed any movement key, toggle game ready state.
     */
    if(game_start){
      var el = EntityManager.entityList;
      for(var i = 0; i < el.length; i++){
        if(typeof el[i].update === 'function')
          el[i].update();
      }
    }else{
      window.addEventListener('keydown', function(e){
        if(e.keyCode === 87 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68){  // W or A or S or D
          clearTimeout(press_key_interval); // End the timeout loop
          document.getElementById('press-to-start').classList.add('disable'); // Add disabled class
          game_start = true; // Start the game
        }
      });
    }

    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });

  scene.clearColor = new BABYLON.Color3(0, 0, 0); // Change the scene clear color to black

  /* A* Debug */
  var start_node = new Node({'x':1,'y':1}, 0, 0);
  var end_node = new Node({'x':6,'y':13}, 0, 0);
  as = new AStar(start_node, end_node);
  var paths = as.solve(false, function(loc){
    if(loc.x < 0 || loc.x >= Game.map[0].length || loc.y < 0 || loc.y >= Game.map.length)
    return false;

    if(Game.map[loc.y][loc.x].collide)
    return false;

    return true;
  });
  console.log(paths);
},3000);

press_key_interval = setInterval(function(){
  var menuText = document.getElementById('press-to-start'); // Get reference to the press key strt text

  // Toggle hidden state to make it blink
  if(menuText.classList.contains('hidden')){ // The menu text contains hidden class
    menuText.classList.remove('hidden'); // Remove the hidden class
  }else{
    menuText.classList.add('hidden'); // Add hidden class if not found
  }
}, 1000);
