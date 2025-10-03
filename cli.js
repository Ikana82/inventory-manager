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
  console.log("1. Tambah Produk");
  console.log("2. Lihat Semua Produk");
  console.log("3. Update Produk");
  console.log("4. Hapus Produk");
  console.log("5. Keluar");
  console.log("========================");
}

async function listProducts() {
  const inventory = loadInventory();
  console.log("\n--- Daftar Produk ---");
  if (inventory.length === 0) {
    console.log("Tidak ada produk dalam inventory.");
  } else {
    console.log("ID\t\tNama\t\tQty\tHarga\t\tTanggal");
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
  const name = await askQuestion("Nama produk: ");
  let quantity;
  while (true) {
    const qtyInput = await askQuestion("Jumlah: ");
    quantity = parseInt(qtyInput);
    if (!isNaN(quantity) && quantity >= 0) break;
    console.log("Jumlah harus berupa angka positif. Coba lagi.");
  }
  let price;
  while (true) {
    const priceInput = await askQuestion("Harga: ");
    price = parseFloat(priceInput);
    if (!isNaN(price) && price >= 0) break;
    console.log("Harga harus berupa angka positif. Coba lagi.");
  }

  const inventory = loadInventory();
  const product = new Product(name, quantity, price);
  inventory.push(product);
  saveInventory(inventory);
  console.log(`Produk "${name}" berhasil ditambahkan!`);
}

async function updateProduct() {
  const inventory = await listProducts();
  if (inventory.length === 0)
    return console.log("Tidak ada produk untuk diupdate.");

  const idInput = await askQuestion("Masukkan ID produk yang mau diupdate: ");
  const idToUpdate = parseInt(idInput);
  const product = inventory.find((p) => p.id === idToUpdate);
  if (!product) return console.log("Produk tidak ditemukan.");

  const newName = await askQuestion(
    `Nama baru (kosong = tetap ${product.name}): `
  );
  const newQty = await askQuestion(
    `Jumlah baru (kosong = tetap ${product.quantity}): `
  );
  const newPrice = await askQuestion(
    `Harga baru (kosong = tetap Rp${product.price}): `
  );

  if (newName.trim()) product.name = newName;
  const newQtyParsed = parseInt(newQty);
  if (newQty.trim() && !isNaN(newQtyParsed) && newQtyParsed >= 0)
    product.quantity = newQtyParsed;
  const newPriceParsed = parseFloat(newPrice);
  if (newPrice.trim() && !isNaN(newPriceParsed) && newPriceParsed >= 0)
    product.price = newPriceParsed;

  saveInventory(inventory);
  console.log("Produk berhasil diupdate!");
}

async function deleteProduct() {
  const inventory = await listProducts();
  if (inventory.length === 0)
    return console.log("Tidak ada produk untuk dihapus.");

  const idInput = await askQuestion("Masukkan ID produk yang mau dihapus: ");
  const idToDelete = parseInt(idInput);
  if (isNaN(idToDelete)) return console.log("ID tidak valid.");

  const newInventory = inventory.filter((p) => p.id !== idToDelete);
  if (newInventory.length === inventory.length)
    return console.log("Produk tidak ditemukan.");

  saveInventory(newInventory);
  console.log("Produk berhasil dihapus!");
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
