const lib = require('../jwt/jwt');
const OrderDetail = require('../models/OrderDetail');
const { ObjectId } = require('mongodb');

// Recevoir toutes les details des commandes
exports.getOrderDetails = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2) {
        const orderDetails = await OrderDetail.find({ });
        return res.status(200).send(orderDetails);
      } else {
        return res.status(400).json({success: false, message: "You are not admin."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};

// Recevoir toutes les détails d'une commande
exports.getUserOrderDetails = async (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
        await OrderDetail.find({ orderId: new ObjectId(req.params.orderId) }).then((orderDetails) => {
          return res.status(200).send(orderDetails);
        }).catch((err) => {
          return res.status(400).json({success: false, message: "Order not valid or you can't access to orders which belong to other users."});
        });
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};