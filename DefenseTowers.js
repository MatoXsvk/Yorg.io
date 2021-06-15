class Wall extends Tower {
  constructor(x, y, other = {}) {
    super(x, y, other);
    this.health = 1000;
    this.connectable = true;
    this.price = { gold: 20, iron: 0, stone: 50 };
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
    this.price = { gold: 100, iron: 200, stone: 200 };
    this.reloadSpeed = 25;
    this.strength = 10;
    this.range = 100;
    this.heading = 0;
    this.specialLevels = [3, 7, 10];

    this.bullets = [];
  }

  upgrade() {
    super.upgrade();
    this.range *= 1.1;
    this.strength *= 1.1;
  }

  specialLevels() {
    this.reloadSpeed -= 5;
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
    // super.update();
    if (frameCount % this.reloadSpeed === 0) this.shoot();
    this.updateBullets();
    this.showRange();
    this.show();
  }

  shoot(_zombies = zombies) {
    if (ammo > 0) {
      const cannonPos = this.getRealPos();
      for (let zombie of _zombies) {
        const zombieDist = distance(cannonPos, zombie.pos);
        if (zombieDist <= this.range) {
          let heading = atan(
            (zombie.pos.y - cannonPos.y) / (zombie.pos.x - cannonPos.x)
          );
          heading =
            cannonPos.x <= zombie.pos.x ? heading - 2 * PI : heading - PI;
          this.heading = heading;
          this.bullets.push(
            new Bullet(this.pos, heading, this.strength, (bullet) =>
              this.bullets.splice(this.bullets.indexOf(bullet), 1)
            )
          );
        }
      }
      ammo--;
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
