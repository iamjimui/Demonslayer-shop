const lib = require('../jwt/jwt');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductType = require('../models/ProductType');
const ProductSize = require('../models/ProductSize');
const ProductWithSize = require('../models/ProductWithSize');
const Comment = require('../models/Comment');

const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require("path");
const multer = require('multer');

const storageProductImage = multer.diskStorage({
  destination: 'public/products_images',
  filename: function(req, file, cb) {
    const directory = './public/products_images/';
    fs.readdir(directory, (err, files) => {
      files.forEach(file => {
         if(file.includes('newProduct_')) {
          fs.unlinkSync(path.resolve(directory + file))
         }
      });
      cb(null, 'newProduct_' + Date.now() + '.' + file.mimetype.split('/')[1]);
    });
  }
})
const uploadProductImage = multer({storage: storageProductImage}).single('image');

// Lister tous les produits
exports.getProducts = async (req,res) => {
  try {
    const products = await Product.aggregate([
      { $lookup:
        {
          from: 'productwithsizes',
          localField: '_id',
          foreignField: 'productId',
          as: 'productSizes'
        }
      }
    ]);
    const productSizes = await ProductSize.find({});
    var i = 0;
    products.forEach((product) => {
      var j = 0;
      product.productSizes.forEach((productProductSize) => {
        productSizes.forEach((productSize) => {
          if (JSON.stringify(productSize._id) === JSON.stringify(productProductSize.productSizeId)) {
            products[i].productSizes[j].productSizeId = productSize;
          }
        });
        j++;
      });
      i++;
    });
    return res.status(200).send(products);
  } catch (err) {
    return res.status(200).json({success:false, message: err});
  }
};

// Créer un produit
exports.createProduct = (req,res) => {
  lib.fetchUserByToken(req).then((user) => {
    uploadProductImage(req, res, async function(err) {
      if (err) {
        return res.status(400).json({success: false, message: "Error trying to import image."});
      } else {
        const jsonNewProduct = JSON.parse(req.body.data);
        const directory = './public/products_images/';
        if (!jsonNewProduct.name || !jsonNewProduct.description || !jsonNewProduct.price || !jsonNewProduct.productTypeId || !jsonNewProduct.productWithSizes || !req.file) {
          return res.status(400).json({success: false, error:"Missing parameters."});
        } else {
          const newProduct = new Product({
            userId: new ObjectId(user._id),
            productTypeId: new ObjectId(jsonNewProduct.productTypeId),
            name: jsonNewProduct.name,
            description: jsonNewProduct.description,
            price: parseFloat(jsonNewProduct.price),
            image: null
          });
          await newProduct.save({}).then(async (product) => {
            jsonNewProduct.productWithSizes.forEach(async (productWithSize) => {
              const newProductWithSize = new ProductWithSize({
                productId: product._id,
                productSizeId: new ObjectId(productWithSize)
              });
              await newProductWithSize.save({});
            });
            fs.rename(directory + req.file.filename, directory + product._id + '.' + req.file.mimetype.split('/')[1], function(err) {
              if ( err ) {
                console.log('ERROR: ' + err);
              }
            });
            fs.readdir(directory, (err, files) => {
              files.forEach(file => {
                 if(file.includes('newProduct_')) {
                  fs.unlinkSync(path.resolve(directory + file))
                 }
              });
            });
            await Product.findOneAndUpdate({ _id: new ObjectId(product._id) }, 
              {$set: {image: `${process.env.URL_API}/products_images/` + product._id + '.' + req.file.mimetype.split('/')[1]}}).then(() => {
              return res.status(200).json({success:true, message: 'You successfully created your product.'});
            }).catch((err) => {
              return res.status(400).json({success: false, message: "Couldn't update your profile picture."});
            });
          }).catch((err) => {
            return res.status(400).json({success:false, message: err});
          });
        }
      }
    });
  }).catch((err) => {
    return res.status(400).json({success: false, message: "You need to log in to be able to create a product."});
  });
};

// Créer un produit sans image
exports.createProductWithNoImage = (req,res) => {
  lib.fetchUserByToken(req).then(async (user) => {
    const newProduct = new Product({
      userId: new ObjectId(user._id),
      productTypeId: new ObjectId(req.body.productTypeId),
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: `${process.env.URL_API}/no-image-found.png`
    });
    
    await newProduct.save({}).then(async (product) => {
      req.body.productWithSizes.forEach(async (productWithSize) => {
        const newProductWithSize = new ProductWithSize({
          productId: product._id,
          productSizeId: new ObjectId(productWithSize)
        });
        await newProductWithSize.save({});
      });
    });
    console.log(newProduct);
    return res.status(200).json({success:true, message: 'You successfully created your product.'});
  }).catch((err) => {
    return res.status(400).json({success: false, message: "You need to log in to be able to create a product."});
  });
};

// Récupère tous les produits d'un utilisateur
exports.getUserProducts = (req,res) => {
  lib.fetchUserByToken(req)
  .then(async (user) => {
    if (req.params.username === user.username || user.role === 2) {
      const searchUser = await User.find({username: req.params.username});
      const myProducts = await Product.aggregate([
        {
          $match:
          {
            userId: searchUser[0]._id
          }
        },
        {
          $lookup:
          {
            from: 'productwithsizes',
            localField: '_id',
            foreignField: 'productId',
            as: 'productWithSizes'
          }
        }
      ]);
      const productTypes = await ProductType.find();
      const productSizes = await ProductSize.find();
      myProducts.forEach((product) => {
        productTypes.forEach((productType) => {
          if (JSON.stringify(product.productTypeId) === JSON.stringify(productType._id)) {
            product.productTypeId = productType;
          }
        });
        product.productWithSizes.forEach((productProductSize) => {
          productSizes.forEach((productSize) => {
            if (JSON.stringify(productProductSize.productSizeId) === JSON.stringify(productSize._id)) {
              productProductSize.productSizeId = productSize;
            }
          });
        });
      });
      return res.status(200).send(myProducts);
    }
    return res.status(400).json({success: false, message: "Your products not found."});
  }).catch((err) => {
    return res.status(400).json({success: false, message: "You are not logged in or You don't have any products."});
  });
};

// Mettre à jour un produit
exports.updateProduct = (req,res) => {
  lib.fetchUserByToken(req)
  .then(async (user) => {
    if (user.role !== 2) {
      await Product.findOneAndUpdate({ _id: new ObjectId(req.body._id), userId: new ObjectId(user._id)}, 
      {$set: {name: req.body.name, description: req.body.description, productTypeId: new ObjectId(req.body.productTypeId), price: parseFloat(req.body.price), image: req.body.image}}).then(async (product) => {
        await ProductWithSize.deleteMany({productId: product._id});
        req.body.productWithSizes.forEach(async (productWithSize) => {
          const newProductWithSize = new ProductWithSize({
            productId: product._id,
            productSizeId: new ObjectId(productWithSize)
          });
          await newProductWithSize.save({});
        });
        return res.status(200).json({success: true, product: product});
      }).catch((err) => {
        return res.status(400).json({success: false, message: "User doesn't exist or your product not found."});
      });
    } else {
      await Product.findOneAndUpdate({ _id: new ObjectId(req.body._id)},
      {$set: {name: req.body.name, description: req.body.description, productTypeId: new ObjectId(req.body.productTypeId), price: parseFloat(req.body.price), image: req.body.image}}).then(async (product) => {
        await ProductWithSize.deleteMany({productId: product._id});
        req.body.productWithSizes.forEach(async (productWithSize) => {
          const newProductWithSize = new ProductWithSize({
            productId: product._id,
            productSizeId: new ObjectId(productWithSize)
          });
          await newProductWithSize.save({});
        });
        return res.status(200).json({success: true, product: product});
      }).catch((err) => {
        return res.status(400).json({success: false, message: "User doesn't exist or Product not found."});
      });
    }
  })
  .catch((err) => {
    return res.status(400).json({success: false, message: "You are not logged in."});
  });
};

// Recevoir les infos d'un produit
exports.getProduct = async (req,res) => {
  try {
    const product = await Product.aggregate([
      {
        $match:
        {
          _id: new ObjectId(req.params.productId)
        }
      },
      { 
        $lookup:
        {
          from: 'productwithsizes',
          localField: '_id',
          foreignField: 'productId',
          as: 'productSizes'
        }
      }
    ]);
    const productSizes = await ProductSize.find({});
    var i = 0;
    product[0].productSizes.forEach((productProductSize) => {
      productSizes.forEach((productSize) => {
        if (JSON.stringify(productSize._id) === JSON.stringify(productProductSize.productSizeId)) {
          product[0].productSizes[i].productSizeId = productSize;
        }
      });
      i++;
    });
    return res.status(200).send(product);
  } catch(err) {
    return res.status(400).json({success: false, message: 'Error when trying to find the product.'});
  }
};

// Supprimer un produit
exports.deleteProduct = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role !== 2) {
        await Product.findOneAndRemove({ _id: new ObjectId(req.params.productId), userId: new ObjectId(user._id) }).then(async () => {
          await ProductWithSize.deleteMany({productId: new ObjectId(req.params.productId)});
          await Comment.deleteMany({productId: new ObjectId(req.params.productId)});
          return res.status(200).json({success: true, message: "Your product got removed."});
        }).catch((err) => {
          return res.status(400).json({success: false, message: "User doesn't exist or your product not found."});
        });
      } else {
        await Product.findOneAndRemove({ _id: new ObjectId(req.params.productId) }).then(async () => {
          await ProductWithSize.deleteMany({productId: new ObjectId(req.params.productId)});
          return res.status(200).json({success: true, message: "Product got removed."});
        }).catch((err) => {
          return res.status(400).json({success: false, message: "User doesn't exist or Product not found."});
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({success: false, message: "You are not logged in."});
  });
};
