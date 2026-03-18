module.exports = app => {
  const orders = require("../controllers/OrderController.js");

  var router = require("express").Router();

  router.get("/orders", orders.getOrders);

  router.get("/orders/:username", orders.getUserOders);

  router.post("/orders", orders.checkout);

  app.use("", router);
};