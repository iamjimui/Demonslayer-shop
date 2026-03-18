const lib = require('../jwt/jwt');
// Instancer le JWT
const jwt = require('jsonwebtoken');
// bcrypt concerne l'hashage des mots de passe
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductWithSize = require('../models/ProductWithSize');
const Comment = require('../models/Comment');
// require('crypto').randomBytes(64).toString('hex') pour la génération d'un code secret JWT
const SECRET_JWT_CODE = "667877b49c1712be993161c057be1deea8444de1aba2ef13da9e27d2487574d2ad59c82d5fbf8a39df46ea939698fba42c84f22814819c3ff2091ab4e424e770";

const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require("path");
const multer = require('multer');

const storagePfp = multer.diskStorage({
  destination: 'public/users_images',
  filename: function(req, file, cb) {
    const directory = './public/users_images/';
    let authorization = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(authorization, SECRET_JWT_CODE);
    let username = decoded.username;
    fs.readdir(directory, (err, files) => {
      files.forEach(file => {
         if(file.includes(username)) {
          fs.unlinkSync(path.resolve(directory + file))
         }
      });
      cb(null, username + '_' + Date.now() + '.' + file.mimetype.split('/')[1]);
    });
  }
})
const uploadPfp = multer({storage: storagePfp}).single('image');

// Lister tous les users
exports.getUsers = async (req,res) => {
  try {
    const users = await User.find({ });
    return res.status(200).send(users);
  } catch(err){
    return res.status(400).json({success:false, message: err});
  }
};

// Enregistrer un user
exports.register = async (req,res) => {  
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({success: false, error:"Missing parameters."});
  }
  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,
    email: req.body.email,
    adresse: req.body.adresse
  });
  await newUser.save({}).then((user) => {
    return res.status(200).json({success: true, message: 'You signed up successfully.'});
  }).catch((err) => {
    return res.status(400).json({success:false, message: err});
  });
};

// Accéder à mes données personnelles
exports.me = async (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      await User.findOne({ _id: new ObjectId(user._id) }).then((me)=> {
        return res.status(200).send(me);
      }).catch((err) => {
        return res.status(400).json({success: false, message: err});
      });
    })
    .catch((err) => {
      return res.status(400).json({success: false, message: "Login required."});
    });
};

// Login
exports.login = async (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({success: false, error:"Missing parameters."});
  }
  await User.findOne({username: req.body.username}).then((user) => {
    if (!user) {
      return res.status(400).json({success:false, message: "User does not exist."});
    } else {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).json({success:false, message: "Wrong password."});
      } else {
        const token = jwt.sign({_id: user._id, username: user.username, role: user.role}, SECRET_JWT_CODE, {expiresIn: 1800});
        return res.status(200).json({success:true, token:token});
      }
    }
  }).catch((err) => {
    return res.status(400).json({success:false, message: err});
  });
};


// Mettre à jour un user
exports.updateUser = (req,res) => {
  lib.fetchUserByToken(req)
  .then(async (user) => {
    if (user.username === req.params.username || user.role === 2) {
      await User.findOne({username: user.username}).then( async (user) => {
        if (!user) {
          return res.status(400).json({success:false, message: "User does not exist."});
        } else {
          if (!bcrypt.compareSync(req.body.old_password, user.password)) {
            return res.status(400).json({success:false, message: "Wrong password."});
          } else {
            if (req.body.new_password) {
              await User.findOneAndUpdate({ username: req.params.username }, {$set: {username: req.body.username, password: bcrypt.hashSync(req.body.new_password, 10), role: parseInt(req.body.role), email: req.body.email, adresse: req.body.adresse, currencies: parseFloat(req.body.currencies)}}).then((updatedUser) => {
                const token = jwt.sign({_id: updatedUser._id, username: updatedUser.username, role: updatedUser.role}, SECRET_JWT_CODE, {expiresIn: 1800});
                return res.status(200).json({success:true, token:token});
              }).catch((err) => {
                return res.status(400).json({success: false, message: err});
              });
            } else {
              await User.findOneAndUpdate({ username: req.params.username }, {$set: {username: req.body.username, role: parseInt(req.body.role), email: req.body.email, adresse: req.body.adresse, currencies: parseFloat(req.body.currencies)}}).then((updatedUser) => {
                const token = jwt.sign({_id: updatedUser._id, username: req.body.username, role: updatedUser.role}, SECRET_JWT_CODE, {expiresIn: 1800});
                return res.status(200).json({success:true, token:token});
              }).catch((err) => {
                return res.status(400).json({success: false, message: err});
              });
            }
          }
        }
      }).catch((err) => {
        return res.status(400).json({success:false, message: err});
      });
    } else {
      return res.status(400).json({success: false, message: "You didn't put your own username."});
    }
  })
  .catch((err) => {
    return res.status(400).json({success: false, message: "You are not logged in."});
  });
};

// Mettre à jour image user
exports.updateUserImage = (req,res) => {
  uploadPfp(req,res,function(err) {
    if (err) {
      return res.status(400).json({success: false, message: "Error while uploading image file."});
    } else {
      const file = req.file;
      lib.fetchUserByToken(req)
      .then(async (user) => {
        if (user.role === 2 || user.username === req.params.username) {
          await User.findOneAndUpdate({ username: req.params.username }, 
          {$set: {image: `${process.env.URL_API}/users_images/` + file.filename}}).then(() => {
            return res.status(200).json({success: true, message: "You uploaded successfully."});
          }).catch((err) => {
            return res.status(400).json({success: false, message: "Couldn't update your profile picture."});
          });
        }
      }).catch((err) => {
          return res.status(400).json({success: false, message: "You are not logged in."});
      });
    }
  })
};

// Recevoir un user
exports.getUser = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2 || user.username === req.params.username) {
        await User.find({username: req.params.username}).then((user) => {
          return res.status(200).json({success: true, user: user});
        }).catch((err) => {
          return res.status(400).json({success: false, message: err});
        });
      } else {
        return res.status(400).json({success: false, message: "You are not Admin or you didn't put your own username."});
      }
    })
    .catch((err) => {
      return res.status(400).json({success: false, message: "You are not logged in."});
  });
};

// Supprimer un user
exports.deleteUser = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2 || user.username === req.params.username) {
        await User.findOneAndRemove({ username: req.params.username }).then(async (foundUser) => {
          const allProducts = await Product.find({userId: foundUser._id});
          await Product.deleteMany({userId: foundUser._id});
          for (const deletedProduct of allProducts) {
            await ProductWithSize.findOneAndDelete({productId: deletedProduct._id});
          }
          await Comment.deleteMany({userId: new ObjectId(foundUser._id)});
          return res.status(200).json({success: true, message: "User and his products/comments got removed."});
        }).catch((err) => {
          return res.status(400).json({success: false, message: err});
        });
      } else {
        return res.status(400).json({success: false, message: "You are not Admin or you didn't put your own username."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: "You are not logged in."});
  });
};