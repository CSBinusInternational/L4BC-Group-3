class EntityManager{
  constructor(){
    this.entityList = [];
  }
}

EntityManager.prototype.pushEntity = function (entity, tagName) {
  /*
   * A function to store entity
   */

  if(typeof entity.start === 'function')
    entity.start();

  if(typeof entity.awake === 'function')
    entity.awake(); // The awake function will be executed before the start function.

  entity.UID = ((new Date()).getTime() + "" + Number.parseInt(Math.random() * 100));
  entity.tagName = tagName;
  this.entityList.push(entity);
};

EntityManager.prototype.getEntity = function (search) {
  /*
   * A function to get entity stored in the storage
   */

  for(var i = 0; i < this.entityList.length; i++){
    if(this.entityList[i].UID == search || this.entityList[i].tagName == search)
      return this.entityList[i];
  }

  return null;
};

EntityManager = new EntityManager();
