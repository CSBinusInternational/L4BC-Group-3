/*
 * Ghost.js - The parent class of pacman ghost
 * Starting coordinate: {x: 11, y: 13} - {x: 16, y: 15}
 */

class Ghost{
  constructor(start_pos, my_name, my_speed){
    this.position = {x: start_pos.x, y: start_pos.y};
    this.meshName = my_name;
    this.moveSpeed = my_speed;

    /* Set the default starting direction. Make it random to make the game interesting */
    this.direction = Math.round((Math.random() * 10) % 4); // Player move direction (0: up, 1: left, 2: down, 3: right)
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
