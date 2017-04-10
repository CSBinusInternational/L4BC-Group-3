require(['include/js/babylon.custom.js']);
require(['include/js/hand.min.1.3.8.js']);

require(['include/js/classes/algorithm/astar.js']);
require(['include/js/classes/game.js']);

var scene;
setTimeout(function(){
  var canvas = document.getElementById('defaultCanvas');
  var engine = new BABYLON.Engine(canvas);
  scene = new BABYLON.Scene(engine);
  var keys = [];

  var light = new BABYLON.PointLight("lightName", BABYLON.Vector3.Zero(), scene);

  var createScene = function () {

    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
    var cam = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 5, new BABYLON.Vector3(0, 3, 0), scene);
    cam.attachControl(canvas);

    var loader = new BABYLON.AssetsManager(scene);

    var position = -5;
    var pos = function(t) {
      t.loadedMeshes.forEach(function(m) {
          m.position.x -= position;
      });
      position += 5;
    };

    var size = {x: Game.map[0].length, y: Game.map.length};
    var wallCount = 0;
    for(var y = 0; y < size.y; y++){
      for(var x = 0; x < size.x; x++){
        var currentTile = Game.map[y][x];
        if(currentTile.collide){
          var box = new BABYLON.Mesh.CreateBox('wall'+wallCount, 1, scene);
          box.position.z = x - size.x / 2;
          box.position.x = y  -size.y / 2;
          box.position.y = -50;
          wallCount++;
        }
      }
    }

    cam.position.x = -40;

    // box.position = new BABYLON.Vector3(0, 2.5, 0);

    return scene;

  };  // End of createScene function

  scene = createScene();

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    window.addEventListener("keydown",
        function(e){
            keys[e.keyCode] = true;
            checkCombinations(e);
        },
    false);

    window.addEventListener('keyup',
        function(e){
            keys[e.keyCode] = false;
        },
    false);

    function checkCombinations(e){
        if(keys["a".charCodeAt(0)] && e.ctrlKey){
            alert("You're not allowed to mark all content!");
            e.preventDefault();
        }
    }

    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
},1000);
