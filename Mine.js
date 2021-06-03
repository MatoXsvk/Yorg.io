class Mine extends Tower {
  static allMines = [];
  static firstPrice = { gold: 10, iron: 15, stone: 20 };
  static basicHarvestSizes = { gold: 3, iron: 4, stone: 5 };
  static mineSpeed = 60;

  constructor(x, y) {
    super(x, y);
    this.price = { gold: 20, iron: 10, stone: 15 };
    this.connected = [];
    this.harvestSize = 1;

    for (let ore of ores) {
      if (
        sqrt((ore.pos.x - this.pos.x) ** 2 + (ore.pos.y - this.pos.y) ** 2) ===
        1
      ) {
        this.connected.push(ore);
      }
    }

    Mine.allMines.push(this);
  }

  static tryUpgradeAll() {
    let totalPriceOfAllMines = { gold: 0, iron: 0, stone: 0 };
    for (let mine of Mine.allMines) {
      for (let mat in mine.price) {
        totalPriceOfAllMines[mat] += mine.price[mat];
      }
    }

    for (let mat in totalPriceOfAllMines) {
      if (totalPriceOfAllMines[mat] > materials) return false;
    }
    for (let mine of Mine.allMines) {
      mine.tryUpgrade();
    }
    console.log(totalPriceOfAllMines);
  }

  show(t = frameCount, max = 50) {
    push();
    rectMode(CENTER);

    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);

    strokeWeight(2.5);
    for (let ore of this.connected) {
      fill(ore.getTypeColor());

      line(
        w * (this.pos.x + 0.5),
        w * (this.pos.y + 0.5),
        w * (ore.pos.x + 0.5),
        w * (ore.pos.y + 0.5)
      );

      strokeWeight(0.2);
      circle(
        w * (ore.pos.x + 0.5) +
          (w *
            ((t + Mine.mineSpeed) % Mine.mineSpeed) *
            (this.pos.x - ore.pos.x)) /
            Mine.mineSpeed,
        w * (ore.pos.y + 0.5) +
          (w *
            ((t + Mine.mineSpeed) % Mine.mineSpeed) *
            (this.pos.y - ore.pos.y)) /
            Mine.mineSpeed,
        10
      );
    }
    fill(100);
    strokeWeight(0.25);
    translate(w * (this.pos.x + 0.5), w * (this.pos.y + 0.5));
    square(0, 0, w * 0.5);
    rotate(PI / 4);
    square(0, 0, w * 0.5);
    noStroke();
    rotate(-PI / 4);
    square(0, 0, w * 0.48);

    stroke(160, 112, 75);
    strokeWeight(1.75);
    line((-1.25 * w) / 8, (1.25 * w) / 8, w / 10, -w / 10);

    stroke(Tower.lvlColors[this.lvl % Tower.lvlColors.length]);
    noFill();
    beginShape();

    vertex(-w / 9, -w / 8.5);
    vertex(w / 9, -w / 9);
    vertex(w / 8.5, w / 9);

    endShape();
    pop();
  }

  harvest(_materials = materials) {
    for (let ore of this.connected)
      _materials[ore.type] +=
        this.harvestSize * Mine.basicHarvestSizes[ore.type];
  }

  sell(_materials = materials, _moneyReturn = moneyReturn) {
    super.sell(_materials, _moneyReturn);
    Mine.allMines.splice(Mine.allMines.indexOf(this), 1);
  }

  upgrade() {
    super.upgrade();
    this.harvestSize *= 2;
  }

  static harvest(_materials = materials) {
    for (let mine of Mine.allMines) {
      mine.harvest(_materials);
    }
  }

  static tryHarvest(_materials = materials) {
    if (frameCount % Mine.mineSpeed === 0) Mine.harvest(_materials);
  }
}
