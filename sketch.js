const grid = { x: 100, y: 75 },
  w = 50;
const oreNum = [
  { name: "gold", num: 50 },
  { name: "iron", num: 75 },
  { name: "stone", num: 80 },
];

let materials = { gold: 100, iron: 100, stone: 100 };
let steel = 0;
let ammo = 1000;
const moneyReturn = 0.95;

const dayLength = 18,
  nightLength = 6,
  hourLength = 1000;

let towers = [],
  ores = [],
  base,
  zombies = [];

let selected;

function setup() {
  createCanvas(windowWidth, windowHeight);

  document.oncontextmenu = () => false;

  for (let o of oreNum) {
    for (let i = 0; i < o.num; i++) {
      let x, y;
      do {
        x = floor(random(grid.x));
        y = floor(random(grid.y));
      } while (!thePosIsNotUsed({ x: x, y: y }));
      ores.push(new Ore(x, y, o.name));
    }
  }
}

function draw() {
  push();

  // translate(width / 2, height / 2);
  translate(off.x, off.y);
  scale(off.zoom);

  background(70);

  for (let tower of towers) if (tower.connectable) tower.showConnections();
  for (let tower of towers) tower.update ? tower.update() : tower.show();

  for (let ore of ores) ore.show();
  if (base) base.update();

  for (let zombie of zombies) zombie.update();

  pop();
  background(0, isDay() ? 0 : 150);

  if (selected) showUpgradeMenu();

  if (mouseIsPressed) {
    if (
      selected &&
      0 <= mouseX &&
      mouseX <= 500 &&
      height - 150 <= mouseY &&
      mouseY <= height
    )
      mousePressedOnBuyingMenu();
    else if (db.x) {
      off.x += mouseX - db.x; // / off.zoom;
      off.y += mouseY - db.y; // / off.zoom;

      db.x = mouseX;
      db.y = mouseY;
      db.times++;
    }
  }
  showInfo();

  Mine.tryHarvest();
}

function showInfo() {
  push();

  textSize(35);
  textStyle(BOLDITALIC);
  strokeWeight(4);

  stroke(0);

  fill("#dd5");
  text("Gold: " + materials.gold, 20, 50);
  fill("#ccf");
  text("Iron: " + materials.iron, 20, 85);
  fill("#ddd");
  text("Stone: " + materials.stone, 20, 125);
  textSize(30);
  fill("#999");
  text("Steel: " + steel, 20, 160);
  textSize(25);
  fill("#632");
  stroke(250);
  strokeWeight(1);
  text("Ammo: " + ammo, 20, 190);

  textAlign(CENTER);

  noStroke();
  fill("#5af");
  textSize(25);
  rect(width, 0, -75, 30);
  fill(50);
  text("Load", width - 37.5, 22);
  fill("#3f8");
  rect(width, 30, -75, 30);
  fill(50);
  text("Save", width - 37.5, 54);

  pop();
  showTime();
}

function showUpgradeMenu() {
  push();
  stroke(80);
  fill(100);
  rect(0, height, 500, -155, 0, 0, 10, 0);

  textSize(25);

  if (base !== selected) {
    stroke("#800");
    if (
      20 < mouseX &&
      mouseX < 120 &&
      height - 60 < mouseY &&
      mouseY < height - 10
    )
      fill("#c33");
    else fill("#d44");
    rect(20, height - 10, 100, -50, 10);

    noStroke();
    fill(10);
    text("Sell", 48, height - 26);
  } else {
    fill("#d44");
    rect(20, height - 10, 100, -50, 10);

    text("X", 62, height - 26);
  }

  stroke("#080");
  if (
    150 < mouseX &&
    mouseX < 270 &&
    height - 60 < mouseY &&
    mouseY < height - 10
  )
    fill("#3c3");
  else fill("#4d4");
  rect(150, height - 10, 120, -50, 10);

  noStroke();
  fill(10);
  text("Upgrade", 161, height - 26);

  textSize(25);
  fill(250);
  stroke(0);
  strokeWeight(3);
  text("Price: ", 300, height - 129);

  textSize(30);
  strokeWeight(3);

  stroke(0);

  fill("#dd5");
  text("\n" + "Gold:" + selected.price.gold, 300, height - 128);

  fill("#ccf");
  text("\n\n" + "Iron: " + selected.price.iron, 300, height - 128);

  fill("#ddd");
  text("\n\n\n" + "Stone: " + selected.price.stone, 300, height - 128);

  textSize(23);

  if (selected === base)
    text("Lvl: " + selected.lvl + "\nHP: " + selected.health, 20, height - 128);
  else
    text(
      "Max lvl: " +
        base.lvl +
        "\nLvl: " +
        selected.lvl +
        "\nHP: " +
        selected.health,
      20,
      height - 128
    );
  pop();
}

function showTime() {
  noStroke();
  fill(125, 170, 250);
  arc(
    width - 50,
    120,
    75,
    75,
    3 * HALF_PI,
    -HALF_PI + TWO_PI * (dayLength / (dayLength + nightLength))
  );

  fill(25, 45, 100);

  arc(
    width - 50,
    120,
    75,
    75,
    -HALF_PI + TWO_PI * (dayLength / (dayLength + nightLength)),
    -HALF_PI
  );

  stroke(250);
  strokeWeight(3);
  translate(width - 50, 120);
  rotate((TWO_PI * getTime()) / (dayLength + nightLength));
  line(0, 0, 0, -37.5);
}
