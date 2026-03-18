module.exports = app => {
  const products = require("../controllers/ProductController.js");

  var router = require("express").Router();

  router.get("/products", products.getProducts);

  router.post("/product/create", products.createProduct);

  router.post("/product/createWithNoImage", products.createProductWithNoImage);

  router.get("/products/:username", products.getUserProducts);

  router.put("/product/:productId", products.updateProduct);

  router.get("/product/:productId", products.getProduct);

  router.delete("/product/:productId", products.deleteProduct);

  app.use("", router);
};