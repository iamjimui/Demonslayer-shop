module.exports = app => {
  const productSizes = require("../controllers/ProductSizeController.js");

  var router = require("express").Router();

  router.get("/productSizes", productSizes.getProductSizes);

  router.post("/productSize/create", productSizes.createProductSize);

  app.use("", router);
};