const fs = require("fs");
// const { resolve } = require("path");
const readline = require("readline");

const DATA_FILE = "inventory.json";

// Interface untuk input user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function loadInventory() {
  if (!fs.existsSync(DATA_FILE)) {
    return []; // Kalau file belum ada, kembalikan array kosong
  }
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error(
      "Gagal membaca atau parse inventory.json. File mungkin rusak."
    );
    return [];
  }
}

function saveInventory(inventory) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(inventory, null, 2));
}

// STRUKTUR DATA
class Product {
  constructor(name, quantity, price) {
    this.id = Date.now(); // ID unik berdasarkan timestamp
    this.name = name;
    this.quantity = parseInt(quantity);
    this.price = parseFloat(price);
    this.createdAt = new Date();
  }
}

// Tampilkan menu
function displayMenu() {
  console.log("\n=== INVENTORY MANAGER ===");
  console.log("1. Tambah Produk");
  console.log("2. Lihat Semua Produk");
  console.log("3. Update Produk");
  console.log("4. Hapus Produk");
  console.log("5. Keluar");
  console.log("========================");
}

// Tambah produk (
async function addProduct() {
  const name = await askQuestion("Nama produk: ");

  let quantity;
  while (true) {
    const qtyInput = await askQuestion("Jumlah: ");
    quantity = parseInt(qtyInput);
    if (!isNaN(quantity) && quantity >= 0) break; // Keluar loop jika input valid
    console.log("Jumlah harus berupa angka positif. Coba lagi.");
  }

  let price;
  while (true) {
    const priceInput = await askQuestion("Harga: ");
    price = parseFloat(priceInput);
    if (!isNaN(price) && price >= 0) break; // // Keluar loop jika input valid
    console.log("Harga harus berupa angka positif. Coba lagi.");
  }

  const inventory = loadInventory();
  const product = new Product(name, quantity, price);
  inventory.push(product);
  saveInventory(inventory);

  console.log(`Produk "${name}" berhasil ditambahkan!`);
}

// Lihat semua produk (tidak banyak berubah, tapi dibuat async untuk konsistensi)
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
  return inventory; // Kembalikan inventory agar bisa dipakai fungsi lain
}

// Main Loop (Loop Utama Program)
async function main() {
  console.log("Selamat datang di Inventory Manager!");

  let running = true;
  while (running) {
    displayMenu();
    const choice = await askQuestion("Pilih menu (1-5): ");

    switch (choice) {
      case "1":
        await addProduct();
        break;
      case "2":
        await listProducts();
        break;
      case "3":
        await updateProduct();
        break;
      case "4":
        await deleteProduct();
        break;
      case "5":
        console.log("Terima kasih sudah menggunakan Inventory Manager!");
        running = false;
        break;
      default:
        console.log("Pilihan tidak valid, coba lagi.");
    }
  }

  rl.close();
}

// Mulai program
main();
