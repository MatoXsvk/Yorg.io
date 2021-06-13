const grid = { x: 100, y: 75 },
  w = 50;
const oreNum = [
  { name: "gold", num: 50 },
  { name: "iron", num: 75 },
  { name: "stone", num: 80 },
];

let maxStorage = { gold: 1000, iron: 200, stone: 500 };
let materials = { gold: 100, iron: 100, stone: 100 };
let towerTypeBuySelected = undefined;
const moneyReturn = 0.95;

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

  background(50);

  for (let tower of towers) if (tower.connectable) tower.showConnections();
  for (let tower of towers) tower.show();

  for (let ore of ores) ore.show();
  if (base) base.show();

  for (let zombie of zombies) zombie.update();

  pop();

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
  stroke("#dd5");
  text("Gold: " + materials.gold, 20, 50);
  stroke("#ccf");
  text("Iron: " + materials.iron, 20, 85);
  stroke("#ddd");
  text("Stone: " + materials.stone, 20, 125);

  textAlign(CENTER);

  fill("#5af");
  textSize(25);
  rect(width, 0, -75, 30);
  fill(100);
  text("Load", width - 37.5, 22);
  fill("#3f8");
  rect(width, 30, -75, 30);
  fill(100);
  text("Save", width - 37.5, 54);

  pop();
}

function showUpgradeMenu() {
  stroke(80);
  fill(100);
  rect(0, height, 500, -155, 0, 0, 10, 0);

  textSize(25);

  if (base !== selected) {
    stroke("#800");
    if (
      20 < mouseX &&
      mouseX < 120 &&
      height - 70 < mouseY &&
      mouseY < height - 20
    )
      fill("#c33");
    else fill("#d44");
    rect(20, height - 20, 100, -50, 10);

    noStroke();
    fill(10);
    text("Sell", 48, height - 36);
  } else {
    fill("#d44");
    rect(20, height - 20, 100, -50, 10);

    text("X", 62, height - 36);
  }

  stroke("#080");
  if (
    150 < mouseX &&
    mouseX < 270 &&
    height - 70 < mouseY &&
    mouseY < height - 20
  )
    fill("#3c3");
  else fill("#4d4");
  rect(150, height - 20, 120, -50, 10);

  noStroke();
  fill(10);
  text("Upgrade", 161, height - 36);
}
