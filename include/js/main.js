require(['include/js/babylon.custom.js']);
require(['include/js/hand.min.1.3.8.js']);

require(['include/js/classes/algorithm/astar.js']);

setTimeout(function(){
  var canvas = document.getElementById('defaultCanvas');
  var engine = new BABYLON.Engine(canvas);
  var scene = new BABYLON.Scene(engine);
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
