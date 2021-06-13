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
