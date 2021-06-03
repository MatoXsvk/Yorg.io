let off = { x: 0, y: 0, zoom: 1 };
let db = { x: false, y: false, xx: false, yy: false, times: 0 };

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
  ores = [];
let base;

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

  for (let tower of towers) tower.show();

  for (let ore of ores) ore.show();
  if (base) base.show();
  pop();

  if (selected) showBuyingMenu();

  if (mouseIsPressed) {
    if (
      selected &&
      0 <= mouseX &&
      mouseX <= 250 &&
      height - 75 <= mouseY &&
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
  stroke("#dd5");
  textSize(35);
  textStyle(BOLDITALIC);
  text("Gold: " + materials.gold, 20, 50);
  pop();
}

function getGridPos(x, y) {
  return {
    x: floor((x - off.x) / (w * off.zoom)),
    y: floor((y - off.y) / (w * off.zoom)),
  };
}

function thePosIsNotUsed(gridPos, towers_arr = towers, ores_arr = ores) {
  if (base && base.pos.x == gridPos.x && base.pos.y == gridPos.y) return false;

  for (let tower of towers_arr) {
    if (tower.pos.x == gridPos.x && tower.pos.y == gridPos.y) return false;
  }

  for (let ore of ores_arr) {
    if (ore.pos.x == gridPos.x && ore.pos.y == gridPos.y) return false;
  }

  return true;
}

function getTowerAtPos(gridPos, towers_arr = towers) {
  if (base && base.pos.x == gridPos.x && base.pos.y == gridPos.y) return base;
  for (let tower of towers_arr) {
    if (tower.pos.x == gridPos.x && tower.pos.y == gridPos.y) return tower;
  }
}

function mousePressed() {
  db = { x: mouseX, y: mouseY, xx: mouseX, yy: mouseY, times: db.times };
}

function mouseReleased(event) {
  if (db.times < 20 && sqrt((mouseX - db.xx) ** 2 + (mouseY - db.yy) ** 2) < 25)
    justClicked(event);
  db = { x: false, y: false, xx: false, yy: false, times: 0 };
}

function keyPressed() {
  console.log(keyCode);
}

function mouseWheel(event) {
  if (event.delta < 0) {
    if (off.zoom < 10) off.zoom *= 1.15;
  } else if (off.zoom >= 0.25) off.zoom /= 1.15;
}

function justClicked() {
  if (selected && mouseX < 250 && mouseY > height - 75) clickOnUpgradeMenu();
  else clickOnMap();
}

function clickOnUpgradeMenu() {
  if (
    base !== selected &&
    10 < mouseX &&
    mouseX < 60 &&
    height - 35 < mouseY &&
    mouseY < height - 10
  ) {
    selected.sell();
    towers.splice(towers.indexOf(selected), 1);
    selected = false;
  }
  if (
    75 < mouseX &&
    mouseX < 135 &&
    height - 35 < mouseY &&
    mouseY < height - 10
  ) {
    selected.tryUpgrade();
  }
}

function clickOnMap() {
  selected = false;
  const gridPos = getGridPos(mouseX, mouseY);
  if (thePosIsNotUsed(gridPos)) {
    clickedOnUnusedPos(gridPos);
  } else {
    clickedOnUsedPos(gridPos);
  }
}

function clickedOnUnusedPos(_gridPos = gridPos) {
  if (base) {
    if (keyCode === 87 && Wall.buyAble()) Wall.buy(_gridPos);
    if (keyCode === 83 && Storage.buyAble()) Storage.buy(_gridPos);
    if (keyCode === 67 && Canon.buyAble()) Canon.buy(_gridPos);
    if (keyCode === 77 && Mine.buyAble()) Mine.buy(_gridPos);
    keyCode = false;
  } else base = new Base(_gridPos.x, _gridPos.y);
}

function clickedOnUsedPos(_gridPos = gridPos) {
  const selectedTower = getTowerAtPos(_gridPos);
  if (selectedTower) {
    selected = selectedTower;
  }
}

function mousePressedOnBuyingMenu() {
  if (
    base !== selected &&
    10 < mouseX &&
    mouseX < 60 &&
    height - 35 < mouseY &&
    mouseY < height - 10
  ) {
    stroke("#800");
    fill("#a11");
    rect(10, height - 10, 50, -25, 10);

    noStroke();
    fill(10);
    text("Sell", 24, height - 18);
  }
  if (
    75 < mouseX &&
    mouseX < 135 &&
    height - 35 < mouseY &&
    mouseY < height - 10
  ) {
    stroke("#070");
    fill("#1a1");
    rect(75, height - 10, 60, -25, 10);

    noStroke();
    fill(10);
    text("Upgrade", 82.5, height - 18);
  }
}

function showBuyingMenu() {
  stroke(80);
  fill(100);
  rect(0, height, 250, -75, 0, 0, 10, 0);

  if (base !== selected) {
    stroke("#800");
    if (
      10 < mouseX &&
      mouseX < 60 &&
      height - 35 < mouseY &&
      mouseY < height - 10
    )
      fill("#c33");
    else fill("#d44");
    rect(10, height - 10, 50, -25, 10);

    noStroke();
    fill(10);
    text("Sell", 24, height - 18);
  } else {
    fill("#d44");
    rect(10, height - 10, 50, -25, 10);

    text("X", 31, height - 18);
  }

  stroke("#080");
  if (
    75 < mouseX &&
    mouseX < 135 &&
    height - 35 < mouseY &&
    mouseY < height - 10
  )
    fill("#3c3");
  else fill("#4d4");
  rect(75, height - 10, 60, -25, 10);

  noStroke();
  fill(10);
  text("Upgrade", 82.5, height - 18);
}
