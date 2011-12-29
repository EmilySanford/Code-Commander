
Class.subclass('Map', {
  
}, {
  
  init: function(mapData) {
    this.tank = null;
    this.objects = [];
    this.mapArray = [
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[]]
    ];
    
    this.load(mapData);
  },
  
  destroy: function() {
    this.each(function(obj) {
      obj.destroy();
    });
    this.objects = [];
    this.mapArray = null;
  },

  getTank: function() {
    return this.tank;
  },
  
  each: function(x, y, callback) {
    var objs = null;
    if (x instanceof Function) {
      objs = this.getObjects();
      callback = x;
    } else {
      objs = this.getObjects(x,y);
    }
    for (var i = 0; i < objs.length; i++) {
      var obj = objs[i];
      callback.call(obj, obj);
    }
  },

  getObject: function(x, y, klass) {
    var objs = this.getObjects(x,y);
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].classRef.className == klass) {
        return objs[i];
      } 
    }
    return null;
  },

  getObjects: function(x,y) {
    if (x === undefined) {
      return this.objects;
    } else {
      if (this.onMap(x,y)) {
        return this.mapArray[y][x];
      } else {
        return null;
      }
    }
  },

  addObject: function(obj, x, y) {
    // Remove if already in map
    this.removeObject(obj);
    // Add it
    this.objects.push(obj);
    var objs = this.getObjects(x,y);
    objs.push(obj);
  },
  
  removeObject: function(obj) {
    this.objects = this.arrayRemove(this.objects, obj);
    var oldPos = obj.getMapPos();
    if (this.onMap(oldPos)) {
      var objs = this.getObjects(oldPos.x,oldPos.y);
      this.mapArray[oldPos.y][oldPos.x] = this.arrayRemove(objs, obj);
    }
  },
  
  arrayRemove: function(array, obj) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] !== obj) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  },
  
  load: function(mapData) {
    var x, y;
    for (y = 0;y < 8;y++) {
      var row = mapData[y].split('');
      for (x = 0;x < 8;x++) {
        this.loadObject(row[x], x, y);
      }
    }
  },
  
  loadObject: function(key, x, y) {
    var obj = this.createObject(key);
    if (obj) {
      if (obj.classRef == Tank) {
        this.tank = obj;
      }
      obj.setMapPos(x,y);
    }
  },
  
  createObject: function(key) {
    switch (key) {  
      case 'T':
        return new Tree(this);
      case '*':
        return new Mine(this);
      case '^':
        return new Tank(this, Dir.UP);
      case '>':
        return new Tank(this, Dir.RIGHT);
      case 'v':
        return new Tank(this, Dir.DOWN);
      case '<':
        return new Tank(this, Dir.LEFT);
      case 'B':
        return new Base(this);
      case 'R':
        return new Rock(this);
      case '-':
        return new Wall(this, 'horizontal');
      case '|':
        return new Wall(this, 'vertical');
      case '+':
        return new Wall(this, 'corner');
      case 'O':
        return new BeamTower(this);
      case '.':
      default:
        return null;
    }
  },
  
  addDir: function(pos, dir, count) {
    var newPos = {x: pos.x, y: pos.y};
    switch(dir) {
      case Dir.UP:
        newPos.y -= count;
        break;
      case Dir.RIGHT:
        newPos.x += count;
        break;
      case Dir.DOWN:
        newPos.y += count;
        break;
      case Dir.LEFT:
        newPos.x -= count;
        break;
    }
    return newPos;
  },
  
  isPassable: function(x, y) {
    if (!this.onMap(x,y)) { return false; }
    
    var pos = (y === undefined) ? x : {x: x, y: y};
    var passable = true;
    this.each(pos.x, pos.y, function(obj) {
      if (!obj.isPassable()) {
        passable = false;
      }
    });
    return passable;
  },
  
  onMap: function(x, y) {
    var pos = (y === undefined) ? x : {x: x, y: y};
    
    if (!pos || pos.x === null) { return false; }
    if (pos.x < 0 || pos.y < 0 || pos.x >= 8 || pos.y >= 8) { return false; }
    return true;
  }
  
});