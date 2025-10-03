const {
  rl,
  displayMenu,
  askQuestion,
  addProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} = require("./cli");

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

main();
