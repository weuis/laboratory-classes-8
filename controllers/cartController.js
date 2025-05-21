const Product = require("../models/Product");
const Cart = require("../models/Cart");

const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = async (request, response) => {
  try {
    const productName = request.body.name;
    const product = await Product.findByName(productName);

    if (product) {
      await Cart.add(product);
      response.status(STATUS_CODE.OK).send();
    } else {
      response.status(STATUS_CODE.NOT_FOUND).send("Product not found");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    response.status(500).send("Error adding product to cart");
  }
};

exports.getProductsCount = async () => {
  return await Cart.getProductsQuantity();
};
