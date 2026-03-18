const lib = require('../jwt/jwt');
const User = require('../models/User');
const ProductType = require('../models/ProductType');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const { ObjectId } = require('mongodb');

// Recevoir toutes les commandes
exports.getOrders = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2) {
        const orders = await Order.find({ });
        return res.status(200).send(orders);
      } else {
        return res.status(400).json({success: false, message: "You are not admin."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};

// Recevoir toutes les commandes d'un utilisateur
exports.getUserOders = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2 || user.username === req.params.username) {
        const searchUser = await User.find({username: req.params.username});
        const productTypes = await ProductType.find({});
        const ordersDetailsUsers = await Order.aggregate([
          {
            $match:
            {
              userId: searchUser[0]._id
            }
          },
          { $lookup:
            {
              from: 'orderdetails',
              localField: '_id',
              foreignField: 'orderId',
              as: 'orderDetails'
            }
          }
        ]).sort({created_at: 'desc'});
        return res.status(200).send(ordersDetailsUsers);
      } else {
        return res.status(400).json({success: false, message: "You can't access to orders which belong to other users."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};

// Insertion d'une commande après achat
exports.checkout = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      const newOrder = new Order({
        userId: new ObjectId(user._id),
        total_price: req.body.totalPrice,
        created_at: new Date()
      });
      await newOrder.save({}).then(async (order) => {
        req.body.products.forEach(async (product) => {
          const newOrderDetails = new OrderDetail({
            orderId: order._id,
            product: {
              _id: new ObjectId(product._id),
              userId: new ObjectId(user._id),
              productTypeId: new ObjectId(product.productSizeId),
              name: product.name,
              description: product.description,
              price: parseFloat(product.productPrice),
              image: product.image
            },
            productSize: product.productSize,
            quantity: product.quantity,
            price: product.price
          });
          await newOrderDetails.save({});
        });
        return res.status(200).json({success:true, newOrder: newOrder});
      }).catch((err) => {
        return res.status(400).json({success:false, message: err});
      });
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};

