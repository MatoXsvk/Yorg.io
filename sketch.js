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

let zombies = [];

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

function justClicked(event) {
  if (event.button === 2)
    zombies.push(
      new Zombie({
        pos: { x: (mouseX - off.x) / off.zoom, y: (mouseY - off.y) / off.zoom },
      })
    );
  else {
    if (selected && mouseX < 500 && mouseY > height - 150) clickOnUpgradeMenu();
    else if (mouseX > width - 75 && mouseY < 60) {
      if (mouseY < 30) {
        console.log("load");
        loadGame();
      } else {
        console.log("save");
        saveGame();
      }
    } else clickOnMap();
  }
}

function clickOnUpgradeMenu() {
  if (
    base !== selected &&
    20 < mouseX &&
    mouseX < 120 &&
    height - 70 < mouseY &&
    mouseY < height - 20
  ) {
    selected.sell();
    towers.splice(towers.indexOf(selected), 1);
    selected = false;
  }
  if (
    150 < mouseX &&
    mouseX < 270 &&
    height - 70 < mouseY &&
    mouseY < height - 20
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
    20 < mouseX &&
    mouseX < 120 &&
    height - 70 < mouseY &&
    mouseY < height - 20
  ) {
    stroke("#800");
    fill("#a11");
    rect(20, height - 20, 100, -50, 10);

    noStroke();
    fill(10);
    text("Sell", 48, height - 36);
  }
  if (
    150 < mouseX &&
    mouseX < 270 &&
    height - 70 < mouseY &&
    mouseY < height - 20
  ) {
    stroke("#070");
    fill("#1a1");
    rect(150, height - 20, 120, -50, 10);

    noStroke();
    fill(10);
    text("Upgrade", 161, height - 36);
  }
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

function getAllTowersOfType(typeName) {
  if (typeName === "Base") return base;
  else {
    const out = [];
    console.log();
    for (let tower_ of towers)
      if (tower_.constructor.name === typeName) out.push(tower_);

    return out;
  }
}

function saveGame() {
  let dataToSave = {
    base: base,
    materials: materials,
    ores: ores,
    towers: towers,
  };
  localStorage.setItem("yorgData", JSON.stringify(dataToSave));
}

function loadGame() {
  let data = JSON.parse(localStorage.getItem("yorgData"));

  if (data) {
    materials = data["materials"];

    if (data["base"]) {
      let other = {};
      for (let prop in data["base"]) other[prop] = data["base"][prop];
      base = new Base(data["base"].pos.x, data["base"].pos.y, other);
    }

    ores = [];
    for (let oreData of data["ores"]) {
      ores.push(new Ore(oreData.pos.x, oreData.pos.y, oreData.type));
    }

    towers = [];
    for (let tower_ of data["towers"]) {
      let allPropsString = "";
      for (let prop in tower_) {
        allPropsString += prop + ": " + JSON.stringify(tower_[prop]) + ", ";
      }

      towers.push(
        eval(
          "new " +
            tower_.typeName +
            "(tower_.pos.x, tower_.pos.y, {" +
            allPropsString +
            "});"
        )
      );
    }
  }
}
