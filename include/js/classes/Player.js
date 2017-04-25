class Player{
  constructor(){
    this.position = {'x': 0, 'y': 0};     // PLayer position in world coordinate
    this.direction = 0;                   // Player move direction (0: up, 1: left, 2: down, 3: right)
  }
}

Player.prototype.start = function () {
  
};

Player.prototype.update = function () {
  window.addEventListener('keydown', function(e){
    if(e.key === 'w'){
      this.direction = 0;
    }

    if(e.key === 'a'){
      this.direction = 1;
    }

    if(e.key === 's'){
      this.direction = 2;
    }

    if(e.key === 'd'){
      this.direction = 3;
    }
  });
};
