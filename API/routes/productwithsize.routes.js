module.exports = app => {
  const productWithSizes = require("../controllers/ProductWithSizeController.js");

  var router = require("express").Router();

  router.get("/productWithSizes", productWithSizes.getProductWithSizes);

  router.get("/productWithSizes/:productId", productWithSizes.getSizesFromProduct);

  app.use("", router);
};