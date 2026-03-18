const lib = require('../jwt/jwt');
const ProductSize = require('../models/ProductSize');
const { ObjectId } = require('mongodb');
// Chercher les tailles
exports.getProductSizes = async (req,res) => {
  try {
    const productSizes = await ProductSize.find({ });
    return res.status(200).send(productSizes);
  } catch (err) {
    return res.status(400).json({success:false, message: err});
  }
};

// Créer une taille
exports.createProductSize = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2) {
        if (!req.body.name) {
          return res.status(400).json({success: false, error:"Missing parameters."});
        }
        const newProductSize = new ProductSize({
          name: req.body.name
        });
        await newProductSize.save({}).then((productSize) => {
          return res.status(200).json({success: true, productSize: productSize});
        }).catch((err) => {
          return res.status(400).json({success:false, message: err});
        });
      } else {
        return res.status(400).json({success:false, message: "You are not admin."});
      }
    })
    .catch((err) => {
      return res.status(400).json({success: false, message: "You need to log in to be able to create a product type."});
    });
};