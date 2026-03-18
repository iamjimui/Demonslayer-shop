const lib = require('../jwt/jwt');
const ProductType = require('../models/ProductType');
const { ObjectId } = require('mongodb');
// Chercher tous les types existants
exports.getProductTypes = async (req,res) => {
  try {
    const productTypes = await ProductType.find({ });
    return res.status(200).send(productTypes);
  } catch (err) {
    return res.status(400).json({success:false, message: err});
  }
};

// Créer un type de produit
exports.createProductType = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2) {
        if (!req.body.name) {
          return res.status(400).json({success: false, error:"Missing parameters."});
        }
        const newProductType = new ProductType({
          name: req.body.name
        });
        await newProductType.save({}).then((productType) => {
          return res.status(200).json({success: true, productType: productType});
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