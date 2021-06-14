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
    this.price = { gold: 10000, iron: 1000, stone: 1000 };
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
  constructor(x, y, other = {}) {
    super(x, y, other);
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
    super.show();
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
  constructor(x, y, other = {}) {
    super(x, y, other);
    this.health = 1000;
    this.connectable = true;
  }

  show() {
    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);
    strokeWeight(5);
    fill(Tower.lvlColors[(this.lvl + 1) % Tower.lvlColors.length]);
    circle((this.pos.x + 0.5) * w, (this.pos.y + 0.5) * w, w * 0.6);

    strokeWeight(1);
    stroke(0);
    circle((this.pos.x + 0.5) * w, (this.pos.y + 0.5) * w, w * 0.5);
  }

  upgrade() {
    super.upgrade();
  }
}

class Canon extends Tower {
  constructor(x, y, other = {}) {
    super(x, y, other);
    this.price = { gold: 100, iron: 200, stone: 300 };
    this.reloadSpeed = 25;
    this.strength = 10;
    this.range = 100;
    this.heading = 0;

    this.bullets = [];
  }

  upgrade() {
    super.upgrade();
    this.range *= 1.1;
    this.strength *= 1.1;
  }

  show() {
    push();

    translate((this.pos.x + 0.5) * w, (this.pos.y + 0.5) * w);
    rotate(this.heading + PI / 2);

    stroke(0);
    strokeWeight(1);

    fill("#dde");
    rect(-0.25 * w, -0.5 * w, w * 0.5, 0.5 * w);
    fill("#aaa");
    circle(0, 0, 0.6 * w);

    pop();
  }

  showRange() {
    fill(250, 10);
    noStroke();
    circle((this.pos.x + 0.5) * w, (this.pos.y + 0.5) * w, this.range * 2);
  }

  showBullets() {
    for (let bullet of this.bullets) {
      bullet.show();
    }
  }

  moveBullets() {
    for (let bullet of this.bullets) {
      bullet.move();
    }
  }

  updateBullets() {
    for (let bullet of this.bullets) {
      bullet.update();
    }
  }

  update() {
    if (frameCount % this.reloadSpeed === 0) this.shoot();
    this.updateBullets();
    this.showRange();
    this.show();
  }

  shoot(_zombies = zombies) {
    const cannonPos = this.getRealPos();
    for (let zombie of _zombies) {
      const zombieDist = distance(cannonPos, zombie.pos);
      if (zombieDist <= this.range) {
        let heading = atan(
          (zombie.pos.y - cannonPos.y) / (zombie.pos.x - cannonPos.x)
        );
        heading = cannonPos.x <= zombie.pos.x ? heading - 2 * PI : heading - PI;
        this.heading = heading;
        this.bullets.push(
          new Bullet(this.pos, heading, this.strength, (bullet) =>
            this.bullets.splice(this.bullets.indexOf(bullet), 1)
          )
        );
      }
    }
  }
}

class Bullet {
  constructor(pos, heading, strength, selfDestruct, props) {
    this.pos = { x: (pos.x + 0.5) * w, y: (pos.y + 0.5) * w };
    this.heading = heading;
    this.strength = strength;
    this.size = 15;
    this.speed = 10;
    this.selfDestruct = selfDestruct;
    this.lifespan = 0;
    this.maxLifeSpan = 500;
    for (let prop in props) {
      this[prop] = props[prop];
    }
  }

  show() {
    fill(200);
    stroke(10);
    circle(this.pos.x, this.pos.y, this.size);
  }

  move() {
    this.pos.x += this.speed * cos(this.heading);
    this.pos.y += this.speed * sin(this.heading);
  }

  hit(_zombies = zombies) {
    for (let zombie of _zombies) {
      if (distance(this.pos, zombie.pos) <= this.size / 2) {
        zombie.health -= this.strength;
        if (zombie.health <= 0) {
          materials.gold += zombie.reward;
          _zombies.splice(_zombies.indexOf(zombie), 1);
        }
        if (this.selfDestruct) this.selfDestruct(this);
        return;
      }
    }
  }

  update() {
    this.show();
    this.move();
    this.hit();
    this.lifespan++;
    if (this.lifespan > this.maxLifeSpan && this.selfDestruct)
      this.selfDestruct(this);
  }
}
