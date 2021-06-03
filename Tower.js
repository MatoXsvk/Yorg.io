class Block {
  constructor(x, y) {
    this.pos = { x: x, y: y };
  }

  show() {
    strokeWeight(0.25);
    circle(w * (this.pos.x + 0.5), w * (this.pos.y + 0.5), w * 0.5);
  }
}

class Tower extends Block {
  static lvlColors = [
    "#ffffff",
    "#ffff88",
    "#88ffff",
    "#ff88ff",
    "#ff9a9a",
    "#aaaaff",
    "#aaffaa",
    "#999999",
    "#55aaaa",
    "#aa55aa",
    "#aaaa55",
    "#aa5555",
    "#55aa55",
    "#5555aa",
    "#777777",
    "#005555",
    "#550055",
    "#555500",
    "#000055",
    "#005500",
    "#550000",
  ];
  static firstPrice = { gold: 10, iron: 0, stone: 0 };
  constructor(x, y) {
    super(x, y);
    this.lvl = 0;
    this.health = 100;
    this.price = { gold: 0, iron: 0, stone: 0 };
    this.totalPrice = this.constructor.firstPrice;
  }

  tryUpgrade(_materials = materials) {
    for (let material in this.price) {
      if (this.price[material] > _materials[material]) {
        console.log(material);
        return false;
      }
    }
    this.upgrade();
  }

  static buyAble(_materials = materials) {
    for (let material in this.prototype.constructor.firstPrice) {
      if (
        this.prototype.constructor.firstPrice[material] > _materials[material]
      )
        return false;
    }
    return true;
  }

  static buy(gridPos, _materials = materials, _towers = towers) {
    console.log(this.price);
    const currentTower = this.prototype.constructor;
    for (let mat in currentTower.firstPrice) {
      _materials[mat] -= currentTower.firstPrice[mat];
    }
    _towers.push(new currentTower(gridPos.x, gridPos.y));
  }

  upgrade(_materials = materials) {
    this.lvl++;
    this.health *= 1.5;
    for (let mat in this.price)
      this.price[mat] *= floor(2 ** sqrt(2 * this.lvl));
    for (let mat in this.price) _materials[mat] -= this.price[mat];

    for (let mat in this.price) this.totalPrice[mat] += this.price[mat];
    this.localLvlColor = Tower.lvlColors[this.lvl % Tower.lvlColors.length];
  }

  sell(_materials = materials, _moneyReturn = moneyReturn) {
    console.log("Total: ", this.totalPrice, "\n return: ", moneyReturn);
    for (let mat in _materials)
      _materials[mat] += this.totalPrice[mat] * _moneyReturn;
  }

  show() {
    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);

    super.show();
  }
}

class Base extends Tower {
  constructor(x, y) {
    super(x, y);
    this.health = 1000;
    this.price = 0;
  }

  show() {
    push();
    strokeWeight(0.01);
    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);

    translate(this.pos.x * w, this.pos.y * w);
    scale(w);

    fill(100);
    circle(0.5, 0.5, 0.75);

    fill("#6e4422");

    beginShape();
    vertex(0.2, 0.1);
    vertex(0.5, 0.25);
    vertex(0.8, 0.1);
    vertex(0.9, 0.2);
    vertex(0.75, 0.5);
    vertex(0.9, 0.8);
    vertex(0.8, 0.9);
    vertex(0.5, 0.75);
    vertex(0.2, 0.9);
    vertex(0.1, 0.8);
    vertex(0.25, 0.5);
    vertex(0.1, 0.2);
    vertex(0.2, 0.1);

    endShape();

    line(0.2, 0.2, 0.5, 0.5);
    line(0.8, 0.2, 0.5, 0.5);
    line(0.2, 0.8, 0.5, 0.5);
    line(0.8, 0.8, 0.5, 0.5);

    stroke(Tower.lvlColors[(this.lvl + 1) % Tower.lvlColors.length]);
    strokeWeight(0.025);
    line(0.1, 0.5, 0.5, 0.5);
    line(0.9, 0.5, 0.5, 0.5);
    line(0.5, 0.1, 0.5, 0.5);
    line(0.5, 0.9, 0.5, 0.5);

    rectMode(CENTER);
    translate(0.5, 0.5);
    square(0, 0, 0.3);
    rotate(PI / 4);
    fill("green");
    square(0, 0, 0.3);

    pop();
  }
}

class Storage extends Tower {
  static firstPrice = { gold: 20, iron: 10, stone: 0 };
  constructor(x, y) {
    super(x, y);
    maxStorage.gold += 250;
    maxStorage.iron += 100;
    maxStorage.stone += 200;
  }

  upgrade() {
    super.upgrade();
    maxStorage.gold += 250 * (this.lvl + 1);
    maxStorage.iron += 100 * (this.lvl + 1);
    maxStorage.stone += 200 * (this.lvl + 1);
  }

  show() {
    push();

    translate(this.pos.x * w, this.pos.y * w);
    scale(w);
    strokeWeight(0.025);
    noFill();

    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);

    square(0.2, 0.2, 0.6);
    rectMode(CENTER);
    circle(0.35, 0.35, 0.2);
    square(0.65, 0.35, 0.2);
    triangle(0.73, 0.75, 0.73, 0.55, 0.55, 0.65);

    pop();
  }
}

class Wall extends Tower {
  constructor(x, y) {
    super(x, y);
    this.health = 1000;
  }

  static buy(gridPos, _materials = materials, _towers = towers) {
    console.log(this.price);
    for (let mat in Wall.firstPrice) {
      _materials[mat] -= Wall.firstPrice[mat];
    }
    _towers.push(new Wall(gridPos.x, gridPos.y));
  }

  upgrade() {
    super.upgrade();
  }
}

class Canon extends Tower {
  constructor(x, y) {
    super(x, y);
    this.reloadSpeed = 1;
    this.strength = 10;
    this.radius = 100;
  }

  static buy(gridPos, _materials = materials, _towers = towers) {
    for (let mat in Wall.firstPrice) {
      _materials[mat] -= Wall.firstPrice[mat];
    }
    _towers.push(new Wall(gridPos.x, gridPos.y));
  }
}
