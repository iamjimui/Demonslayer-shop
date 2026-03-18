module.exports = app => {
  const productTypes = require("../controllers/ProductTypeController.js");

  var router = require("express").Router();

  router.get("/productTypes", productTypes.getProductTypes);

  router.post("/productType/create", productTypes.createProductType);

  app.use("", router);
};