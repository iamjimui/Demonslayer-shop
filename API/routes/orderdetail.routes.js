module.exports = app => {
  const orderdetails = require("../controllers/OrderDetailController.js");

  var router = require("express").Router();

  router.get("/orderDetails", orderdetails.getOrderDetails);

  router.get("/orderDetails/:orderId", orderdetails.getUserOrderDetails);

  app.use("", router);
};