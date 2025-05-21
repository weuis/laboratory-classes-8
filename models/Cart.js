const { getDatabase } = require("../database");

const COLLECTION_NAME = "carts";

class Cart {
  constructor() {}

  static async getCart() {
    const db = getDatabase();

    try {
      const cart = await db.collection(COLLECTION_NAME).findOne({});

      if (!cart) {
        await db.collection(COLLECTION_NAME).insertOne({ items: [] });
        return { items: [] };
      }

      return cart;
    } catch (error) {
      console.error("Error occurred while searching cart");

      return { items: [] };
    }
  }

  static async add(product) {
    const db = getDatabase();

    try {
      if (!product || !product.name) {
        throw Error('Invalid product');
      }

      const cart = await this.getCart();
      const searchedProduct = cart.items.find(
          (item) => item.product.name === product.name
      );

      if (searchedProduct) {
        searchedProduct.quantity += 1;
      } else {
        cart.items.push({ product, quantity: 1 });
      }

      await db
          .collection(COLLECTION_NAME)
          .updateOne({}, { $set: { items: cart.items } });
    } catch (error) {
      console.error("Error occurred while adding product to cart");
    }
  }

  static async deleteProductByName(productName) {
    const db = getDatabase();

    try {
      const cart = await this.getCart();

      const updatedItems = cart.items.filter(
          (item) => item.product.name !== productName
      );

      await db
          .collection(COLLECTION_NAME)
          .updateOne({}, { $set: { items: updatedItems } });

    } catch (error) {
      console.error("Error occurred while deleting product from cart");
    }
  }

  static async getItems() {
    try {
      const cart = await this.getCart();

      return cart.items;
    } catch (error) {
      console.error("Error occurred while searching for products in cart");

      return [];
    }
  }

  static async getProductsQuantity() {
    try {
      const cart = await this.getCart();
      const productsQuantity = cart.items.reduce(
          (total, item) => total + item.quantity,
          0
      );

      return productsQuantity;
    } catch (error) {
      console.error("Error occurred while getting quantity of items in cart");

      return 0;
    }
  }

  static async getTotalPrice() {
    const db = getDatabase();

    try {
      const cart = await this.getCart();
      const totalPrice = cart.items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
      );

      return totalPrice;
    } catch (error) {
      console.error(
          "Error occurred while calcualting total price of items in cart"
      );

      return 0;
    }
  }

  static async clearCart() {
    const db = getDatabase();

    try {
      await db
          .collection(COLLECTION_NAME)
          .updateOne({}, { $set: { items: [] } });
    } catch (error) {
      console.error("Error occurred while clearing cart");
    }
  }
}

module.exports = Cart;
