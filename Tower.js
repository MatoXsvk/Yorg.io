class Block {
  constructor(x, y) {
    this.pos = { x: x, y: y };
  }

  show() {
    stroke(250);
    strokeWeight(1);
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
  constructor(x = 0, y = 0, other = {}) {
    super(x, y);
    this.lvl = 0;
    this.health = 100;
    this.maxHealth = this.health;
    this.price = { gold: 0, iron: 0, stone: 0 };
    this.totalPrice = this.constructor.firstPrice;
    this.typeName = this.constructor.name;
    this.connectable = false;
    this.specialLevels = [];

    this.healSpeed = 150;
    this.healStrength = 15;

    for (let prop in other) this[prop] = other[prop];
  }

  tryUpgrade(_materials = materials) {
    if (this === base || this.lvl < base.lvl) {
      for (let material in this.price) {
        if (this.price[material] > _materials[material]) {
          return false;
        }
      }
      this.upgrade();
    }
  }

  upgrade(_materials = materials) {
    this.lvl++;
    this.health = round(this.health * 1.2);

    for (let mat in this.price) _materials[mat] -= this.price[mat];
    for (let mat in this.price) this.totalPrice[mat] += this.price[mat];
    for (let mat in this.price)
      this.price[mat] *= floor(2 ** sqrt(2 * this.lvl));

    this.localLvlColor = Tower.lvlColors[this.lvl % Tower.lvlColors.length];
    if (this.lvl === this.specialLevels[0]) {
      this.specialLevels.splice(0, 1);
      if (this.specialUpgrade) this.specialUpgrade();
    }
  }

  getType() {
    return this.typeName;
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
    const currentTower = this.prototype.constructor;
    for (let mat in currentTower.firstPrice) {
      _materials[mat] -= currentTower.firstPrice[mat];
    }
    _towers.push(new currentTower(gridPos.x, gridPos.y));
  }

  showConnections() {
    stroke(240);
    strokeWeight(15);
    for (let wall of getAllTowersOfType(this.typeName)) {
      if (wall !== this && this.isTowerNextToThis(wall)) {
        line(
          (this.pos.x + 0.5) * w,
          (this.pos.y + 0.5) * w,
          (wall.pos.x + 0.5) * w,
          (wall.pos.y + 0.5) * w
        );
      }
    }
  }

  update() {
    if (this.health < this.maxHealth && frameCount % this.healSpeed === 0) {
      this.health += this.healStrength;
      if (this.health > this.maxHealth) this.health = this.maxHealth;
    }
    if (this.show) this.show();
  }

  sell(_materials = materials, _moneyReturn = moneyReturn) {
    console.log("Total: ", this.totalPrice, "\n return: ", moneyReturn);
    for (let mat in _materials)
      _materials[mat] += this.totalPrice[mat] * _moneyReturn;
  }

  getRealPos() {
    return { x: (this.pos.x + 0.5) * w, y: (this.pos.y + 0.5) * w };
  }

  isTowerNextToThis(tower) {
    return (
      sqrt((this.pos.x - tower.pos.x) ** 2 + (this.pos.y - tower.pos.y) ** 2) <
      2
    );
  }
}

class Base extends Tower {
  constructor(x, y, other = {}) {
    super(x, y, other);
    this.health = 10000;
    this.maxHealth = 10000;
    this.price = { gold: 10000, iron: 10, stone: 10 };
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

  update() {
    super.update();
    // this.show();
  }
}

// class Storage extends Tower {
//   static firstPrice = { gold: 20, iron: 10, stone: 0 };
//   constructor(x, y, other = {}) {
//     super(x, y, other);
//     maxStorage.gold += 250;
//     maxStorage.iron += 100;
//     maxStorage.stone += 200;
//   }

//   upgrade() {
//     super.upgrade();
//     maxStorage.gold += 250 * (this.lvl + 1);
//     maxStorage.iron += 100 * (this.lvl + 1);
//     maxStorage.stone += 200 * (this.lvl + 1);
//   }

//   show() {
//     super.show();
//     push();

//     translate(this.pos.x * w, this.pos.y * w);
//     scale(w);
//     strokeWeight(0.025);
//     noFill();

//     stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);

//     square(0.2, 0.2, 0.6);
//     rectMode(CENTER);
//     circle(0.35, 0.35, 0.2);
//     square(0.65, 0.35, 0.2);
//     triangle(0.73, 0.75, 0.73, 0.55, 0.55, 0.65);

//     pop();
//   }
// }

class Factory extends Tower {
  constructor(x, y, other = {}) {
    super(x, y, other);
    this.speed = 30;
    this.efficiency = 2;
    this.specialLevels = [3, 6, 10];
  }

  upgrade() {
    super.upgrade();
    this.efficiency = ceil(this.efficiency * 1.2);
  }

  specialUpgrade() {
    this.speed -= 5;
  }

  makeAmmoMaterial() {
    if (
      frameCount % this.speed === 0 &&
      materials.stone > 60 &&
      materials.iron > 75
    ) {
      materials.stone -= 2;
      materials.iron--;
      ammoMaterial += 2;
    }
  }

  update() {
    super.update();
    this.makeAmmoMaterial();
    this.show();
  }
}

class CanonBallFacory extends Factory {
  constructor(x, y, other = {}) {
    super(x, y, other);
  }

  show() {
    push();
    translate(this.pos.x * w, this.pos.y * w);

    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);

    fill(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);
    rect(w * 0.1, w * 0.1, w * 0.8, w * 0.8, 10);
    stroke(250);
    fill(50);
    circle(w * 0.5, w * 0.4, w * 0.32);
    circle(w * 0.37, w * 0.6, w * 0.32);
    circle(w * 0.63, w * 0.6, w * 0.32);

    pop();
  }

  makeAmmo() {
    if (
      frameCount % this.speed === 0 &&
      materials.iron > 25 &&
      ammoMaterial >= 4
    ) {
      materials.iron -= 1;
      ammoMaterial -= 4;
      ammo += 4;
    }
  }
  update() {
    super.update();
    this.makeAmmo();
    this.show();
  }
}
