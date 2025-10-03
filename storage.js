const fs = require("fs");
const DATA_FILE = "inventory.json";

function loadInventory() {
  if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
}

function saveInventory(inventory) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(inventory, null, 2));
}

module.exports = { loadInventory, saveInventory };
