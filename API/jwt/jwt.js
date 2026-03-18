const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET_JWT_CODE = process.env.SECRET_KEY;

// Rechercher un user via token
module.exports.fetchUserByToken = function (req) {
  return new Promise((resolve, reject) => {
    if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization.split(' ')[1];
      var decoded = jwt.verify(authorization, SECRET_JWT_CODE);
      let userId = decoded._id;
      User.findOne({_id: userId}).then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject("Token error");
      });
    } else {
      reject("No token found");
    }
  });
}
