# Contributor's Guide

## Table of Content
1. **Entity Manager**
    1. What is the Entity Manager?
    1. Methods
1. **The Player**
    1. Variables
    1. Constructor
    1. Methods
1. **Ghost NPC**
    1. What is this?
    1. Variable
    1. Methods
1. **Game**
    1. Variable
    1. Methods
1. **FAQ**

## **Entity Manager**
### What is the Entity Manager
The entity manager is a global class that allows easy access to game entity. This class should hold every entity the developer creates for the game (in theory)
### Methods
Method     | Description | Usage  | Example
-----------|-------------|--------|---------
**pushEntity** | Push new entity to the manager so that it can be referenced easily | `void pushEntity(object entity, string accessName)` | `EntityManager.pushEntity(pellet, 'testPellet');`
**getEntity**  | Get entity stored by the entity manager. argument accepts the name of the object specified from `pushEntity`'s accessName or the UID of the object. | `object getEntity(string toSearch)` | `var testPellet = EntityManager.getEntity('testPellet'); // Search by tag name`<br>or<br>`var testPellet = EntityManager.getEntity(149570738922161); // Search by UID`

## **The Player**
### variable
Name     | Description  
---------|-------------
direction  | The traveling direction of the player. Integer from 0 - 3. 0: up, 1: left, 2: down, 3: right
moveSpeed | The movement speed of the player. How much unit the player will move every frame
allow_move | Returns whether the player has a valid move or not (Read only)
has_teleport | Returns whether the player has recently teleported or not (Read Only)
score | The player's current score. Incremented once the player eat a pellet

### Constructor
Method     | Description | Usage
-----------|-------------|-------
Player | Creates a new player object. | `new Player()`

### Methods
Method     | Description
-----------|------------
start | The function that will be executed once the object is instantiated
update | The function that will be executed every frame

## **Ghost NPC**
The Ghost class is the base class of the NPC
### Variable
Name     | Description
-----------|------------
position | The position of the NPC relative to the `Game.map` grid coordinate
meshName | The name of the mesh babylon should save
moveSpeed | The movement speed of the NPC. How much unit the NPC will move every frame
direction | The traveling direction of the NPC. Integer from 0 - 3. 0: up, 1: left, 2: down, 3: right

### Methods
Method     | Description | Usage | Example
-----------|-------------|-------|---------
start | The function that will be executed once the object is instantiated | |
update | The function that will be executed every frame | |
moveTo | Set new direction for the NPC. Accepts position object | `moveTo(object coordinate)` | `moveTo({x: 11, y: 13})`
move | Move the NPC relative to the direction | `void move()` | `move()`
checkSquare | Convert the current NPC's world coordinate to `Game.map` coordinate | `void checkSquare()` | `checkSquare()`

## **Game**
### Variable
Name     | Description
---------|------------
map | A 2D array representing the game's map. In the start of the game, the value of the array is integer. The array may be converted to object by calling `processMap()` function
### Methods
Method     | Description | Usage | Example
-----------|-------------|-------|---------
processMap | Convert the integer representation of the map to an object representation. This method is global | `void processMap()` | `processMap()`
resetMap | Reset the object representation of the map. Useful to reset game map state. This method is global | `void resetMap()` | `resetMap()`

## **FAQ**
### How do I get the world coordinate of an entity (NPC or player)?
Use `scene.getMeshByName(meshName).position`. This will return Vector3 object. Use the `Z` property to get Left and Right, Use the `X` property to get Forward (Up) and Backward (Down).
