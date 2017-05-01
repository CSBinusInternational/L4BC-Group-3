/*
 * A* path finding
 * A port from the Java implementation by Stanislaus Krisna
 * Port by Stanislaus Krisna
 */

/* Node()
 * A class to store the current node of the graph
 */
class Node{
  constructor(l,s,n){
    this.location = {'x': l.x, 'y': l.y}; // Store the location of the node
    this.score = s;                   // Store the heuristic score of the node

    this.path = n;                 // Store the parent of this node
  }
}

/*
 * The actual A* class
 * Class will try to find the closest path to the player
 */
class AStar{
  constructor(s, e, f){
    this.start = s;               // Store the starting node
    this.end   = e;               // Store the ending node

    this.search_queue = [];       // Queue to store nodes to search
    this.searched_queue = [];     // Queue to store nodes that has been searched

    this.search_queue.push(s); // Push the first node to the search queue
  }
}

/*
 * AStar.prototype.solve()
 * A function that will find the shortest path to the end node
 * Function will return the nodes from the start to the end (array)
 */
AStar.prototype.solve = function (allow_diagonal, move_checker) {
  console.log('Searching for best path');
  var t0 = performance.now();

  if(typeof allow_diagonal !== 'boolean')      // Check if allow_diagonal is given
  throw new Error('Unable to verify move. allow_diagonal must be a boolean.');

  if(typeof move_checker !== 'function')       // Check if a valid move checker is supplied
  throw new Error('Unable to verify move. move_checker undefined or not a function.');

  /*
   * Check every node in the search queue and find the closest path
   * from the current node to the end node. Once the shortest path has
   * been found, return the nodes.
   */
  while(this.search_queue.length != 0){              // Loop through the search queue
    var selected = this.search_queue.shift();   // Get first node in the queue
    this.searched_queue.push(selected);         // Add the selected node to the searched queue

    /* Check if the current node is the end node */
    if(selected.location.x == this.end.location.x && selected.location.y == this.end.location.y){
      var t1 = performance.now();
      console.log("Search took " + (t1 - t0) + " milliseconds.");

      var path_to_evaluate = selected;          // Variable the will hold the node to analyze
      var final_path = [];                      // Array that will hold all the path taken to the end

      while(path_to_evaluate.path != null){
        final_path.push(path_to_evaluate.location);      // Push the currently evaluated node to the final path
        path_to_evaluate = path_to_evaluate.path;
      }

      return final_path.reverse();                        // End the function (solution is found)
    }

    /* Check every side of the current node */
    move_check_loop:
    for(var i = 0; i < (allow_diagonal ? 8 : 4); i++){ // Less then 8 if diagonal is allowed, less then 4 if diagonal not allowed
      var location = {'x': selected.location.x, 'y': selected.location.y};
      switch (i) {
        case 0: location.y -= 1; break;        // Check upper node
        case 1: location.x -= 1; break;        // Check left node
        case 2: location.y += 1; break;        // Check bottom node
        case 3: location.x += 1; break;        // Check right node

        case 4:                                // Check upper left
          location.x -= 1;
          location.y -= 1;
        break;
        case 5:                                // Check upper right
          location.x += 1;
          location.y -= 1;
        break;
        case 6:                                // Check bottom left
          location.x -= 1;
          location.y += 1;
        break;
        case 7:                                // Check bottom right
          location.x += 1;
          location.y += 1;
        break;

        default:
          throw new Error('Oh god... this is bad. You should never see this error (i = ' + i + ')');
      }

      if(!move_checker(location))     // Validate the new coordinate
        continue;

      /* Find the new coordinate in the search queue. Skip if found */
      for(var j = 0; j < this.search_queue.length; j++){
        if(location.x === this.search_queue[j].location.x && location.y === this.search_queue[j].location.y)
        continue move_check_loop;
      }

      /* Verify if the new coordinate has been evaluated */
      for(var j = 0; j < this.searched_queue.length; j++){
        if(location.x === this.searched_queue[j].location.x && location.y === this.searched_queue[j].location.y)
        continue move_check_loop;
      }

      /* Add the new coordinate to the search queue */
      var heuristic_score = Math.abs(location.x - this.end.location.x) + Math.abs(location.y - this.end.location.y);     // Calculate heuristic score
      var new_node = new Node(location, heuristic_score, selected);                                    // Make new node object
      this.search_queue.push(new_node);                                                                // Add to search queue

      /* Sort queue based on heuristics */
      this.search_queue.sort(function(a,b){
        return a.score - b.score;
      });
    }
  }

  return [];                                    // Return an empty array when no solution is found
};
