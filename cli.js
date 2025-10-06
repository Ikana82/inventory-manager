const readline = require("readline");
const Product = require("./product");
const { loadInventory, saveInventory } = require("./storage");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function displayMenu() {
  console.log("\n=== INVENTORY MANAGER ===");
  console.log("1. Add Product");
  console.log("2. List All Products");
  console.log("3. Update Product");
  console.log("4. Delete Product");
  console.log("5. Exit");
  console.log("========================");
}

async function listProducts() {
  const inventory = loadInventory();
  console.log("\n--- Product List ---");
  if (inventory.length === 0) {
    console.log("No products in inventory.");
  } else {
    console.log("ID\t\tName\t\tQty\tPrice\t\tDate");
    console.log("-".repeat(70));
    inventory.forEach((p) => {
      console.log(
        `${p.id}\t${p.name.padEnd(12)}\t${p.quantity}\tRp${p.price.toFixed(
          2
        )}\t${new Date(p.createdAt).toLocaleDateString()}`
      );
    });
  }
  return inventory;
}

async function addProduct() {
  const name = await askQuestion("Product name: ");
  let quantity;
  while (true) {
    const qtyInput = await askQuestion("Quantity: ");
    quantity = parseInt(qtyInput);
    if (!isNaN(quantity) && quantity >= 0) break;
    console.log("Quantity must be a positive number. Try again.");
  }
  let price;
  while (true) {
    const priceInput = await askQuestion("Price: ");
    price = parseFloat(priceInput);
    if (!isNaN(price) && price >= 0) break;
    console.log("Price must be a positive number. Try again.");
  }

  const inventory = loadInventory();
  const product = new Product(name, quantity, price);
  inventory.push(product);
  saveInventory(inventory);
  console.log(`Product "${name}" added successfully!`);
}

async function updateProduct() {
  const inventory = await listProducts();
  if (inventory.length === 0) return console.log("No products to update.");

  const idInput = await askQuestion("Enter the product ID to update: ");
  const idToUpdate = parseInt(idInput);
  const product = inventory.find((p) => p.id === idToUpdate);
  if (!product) return console.log("Product not found.");

  const newName = await askQuestion(
    `New name (empty = keep "${product.name}"): `
  );
  const newQty = await askQuestion(
    `New quantity (empty = keep ${product.quantity}): `
  );
  const newPrice = await askQuestion(
    `New price (empty = keep $${product.price}): `
  );

  if (newName.trim()) product.name = newName;
  const newQtyParsed = parseInt(newQty);
  if (newQty.trim() && !isNaN(newQtyParsed) && newQtyParsed >= 0)
    product.quantity = newQtyParsed;
  const newPriceParsed = parseFloat(newPrice);
  if (newPrice.trim() && !isNaN(newPriceParsed) && newPriceParsed >= 0)
    product.price = newPriceParsed;

  saveInventory(inventory);
  console.log("Product updated successfully!");
}

async function deleteProduct() {
  const inventory = await listProducts();
  if (inventory.length === 0) return console.log("No products to delete.");

  const idInput = await askQuestion("Enter the product ID to delete: ");
  const idToDelete = parseInt(idInput);
  if (isNaN(idToDelete)) return console.log("Invalid ID.");

  const newInventory = inventory.filter((p) => p.id !== idToDelete);
  if (newInventory.length === inventory.length)
    return console.log("Product not found.");

  saveInventory(newInventory);
  console.log("Product deleted successfully!");
}

module.exports = {
  rl,
  askQuestion,
  displayMenu,
  addProduct,
  listProducts,
  updateProduct,
  deleteProduct,
};
