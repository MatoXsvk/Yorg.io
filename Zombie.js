class Zombie {
  constructor() {
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
    this.demage = 10;
    this.speed = 1;
  }

  show() {
    stroke(10);
    strokeWeight(1);
    fill(100, 100, 200);
    circle(this.pos.x, this.pos.y, 17.5);

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
    if (target) {
      const dx = this.pos.x - target.getRealPos().x;
      const dy = this.pos.y - target.getRealPos().y;
      this.pos.x -= this.speed * (dx / max(dx, dy));
      this.pos.y -= this.speed * (dy / max(dx, dy));
    }
  }
}
