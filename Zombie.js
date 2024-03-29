class Zombie {
  constructor(props) {
    const randNum = floor(random() * 4);
    this.pos =
      randNum === 0
        ? { x: floor(random(grid.x * w)), y: 0 }
        : randNum === 1
        ? { x: grid.x * w, y: floor(random(grid.y * w)) }
        : randNum === 2
        ? { x: floor(random(grid.x * w)), y: grid.y * w }
        : { x: 0, y: floor(random(grid.y * w)) };
    this.health = 100;
    this.maxHealth = this.health;
    this.demage = 40;
    this.attackSpeed = 50;
    this.speed = 5;
    this.r = 17.5;
    this.lifespan = 5000;
    this.timeLiving = 0;
    this.reward = 10;

    for (let prop in props) this[prop] = props[prop];
  }

  update() {
    this.timeLiving++;
    if (this.timeLiving >= this.lifespan)
      zombies.splice(zombies.indexOf(this), 1);

    if (this.isTouchingTower()) this.attack();
    else this.move();

    this.show();
  }

  show() {
    stroke(10);
    strokeWeight(1);
    fill(100, 100, 200);
    circle(this.pos.x, this.pos.y, this.r);

    strokeWeight(3);

    stroke("red");
    line(
      this.pos.x + 10,
      this.pos.y + 15,
      this.pos.x - 10 + (20 * this.health) / this.maxHealth,
      this.pos.y + 15
    );
    stroke("green");
    line(
      this.pos.x - 10,
      this.pos.y + 15,
      this.pos.x - 10 + (20 * this.health) / this.maxHealth,
      this.pos.y + 15
    );
  }

  move(target = base) {
    if (target && !this.isTouchingTower()) {
      const dx = target.getRealPos().x - this.pos.x;
      const dy = target.getRealPos().y - this.pos.y;
      this.pos.x += this.speed * (dx / max(abs(dx), abs(dy))) || 0;
      this.pos.y += this.speed * (dy / max(abs(dx), abs(dy))) || 0;
    }
  }

  getVel(target = base) {
    if (target) {
      const dx = target.getRealPos().x - this.pos.x;
      const dy = target.getRealPos().y - this.pos.y;
      return [
        this.speed * (dx / max(abs(dx), abs(dy))) || 0,
        this.speed * (dy / max(abs(dx), abs(dy))) || 0,
      ];
    }
    return [(0, 0)];
  }

  attack(tower) {
    if (frameCount % this.attackSpeed === 0) {
      tower = tower || this.getTouchingTowers();

      tower.health -= this.demage;
      if (tower.health < 0) {
        if (tower !== base) {
          if (tower === selected) selected = undefined;
          towers.splice(towers.indexOf(tower), 1);
        } else {
          base.health = 0;
          noLoop();
        }
      }
    }
  }

  isTouchingTower(_towers = towers, _base = base) {
    for (let tower of _base ? [...towers, base] : [...towers]) {
      if (
        sqrt(
          (this.pos.x - tower.getRealPos().x) ** 2 +
            (this.pos.y - tower.getRealPos().y) ** 2
        ) <
        w / 2 + this.r
      )
        return true;
    }
    return false;
  }

  getTouchingTowers(_towers = towers, _base = base) {
    const out = [];
    for (let tower of _base ? [...towers, base] : [...towers]) {
      if (
        sqrt(
          (this.pos.x - tower.getRealPos().x) ** 2 +
            (this.pos.y - tower.getRealPos().y) ** 2
        ) <
        w / 2 + this.r
      )
        return tower;
    }
  }
}
