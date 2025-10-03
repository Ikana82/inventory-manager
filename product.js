class Product {
  constructor(name, quantity, price) {
    this.id = Date.now();
    this.name = name;
    this.quantity = parseInt(quantity);
    this.price = parseFloat(price);
    this.createdAt = new Date();
  }
}

module.exports = Product;
