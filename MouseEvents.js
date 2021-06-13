let off = { x: 0, y: 0, zoom: 1 };
let db = { x: false, y: false, xx: false, yy: false, times: 0 };

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
  console.log(keyCode);
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
