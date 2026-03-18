const ProductWithSize = require('../models/ProductWithSize');
const { ObjectId } = require('mongodb');
// Chercher les produits avec tailles spécifiées
exports.getProductWithSizes = async (req,res) => {
  try {
    const productWithSizes = await ProductWithSize.find({ });
    return res.status(200).send(productWithSizes);
  } catch (err) {
    return res.status(400).json({success:false, message: err});
  }
};

// Chercher les tailles d'un produit
exports.getSizesFromProduct = async (req,res) => {
  try {
    const productWithSizesByProductId = await ProductWithSize.find({productId: new ObjectId(req.params.productId)});
    return res.status(200).send(productWithSizesByProductId);
  } catch (err) {
    return res.status(400).json({success:false, message: err});
  }
};