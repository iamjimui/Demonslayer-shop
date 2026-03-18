const lib = require('../jwt/jwt');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const { ObjectId } = require('mongodb');

exports.getComments = async (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2) {
        const comments = await Comment.find({ });
        return res.status(200).send(comments);
      } else {
        return res.status(400).json({success: false, message: "You are not admin."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};

exports.getUserComments = async (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      if (user.role === 2 || user.username === req.params.username) {
        const comments = await Comment.find({userId: new ObjectId(user._id)});
        return res.status(200).send(comments);
      } else {
        return res.status(400).json({success: false, message: "You are not admin."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: err});
    });
};

exports.getAllCommentsFromProduct = async (req,res) => {
  try {
    const comments = await Comment.find({productId: new ObjectId(req.params.productId)}).sort({created_at: 'desc'});
    return res.status(200).send(comments);
  } catch(err) {
    return res.status(400).json({success: false, message: err});
  };
};

exports.createComment = (req,res) => {
  lib.fetchUserByToken(req)
    .then(async (user) => {
      const commentFound = await Comment.find({productId: new ObjectId(req.params.productId), userId: new ObjectId(user._id)});
      if (commentFound.length === 0) {
        const newComment = new Comment({
          productId: new ObjectId(req.params.productId),
          userId: new ObjectId(user._id),
          comment: req.body.comment,
          rating: parseInt(req.body.rating),
          created_at: new Date()
        });
        await newComment.save({});
        var totalRatingOfProduct = 0;
        const allCommentsOfProduct = await Comment.find({productId: new ObjectId(req.params.productId)}).sort({created_at: 'desc'});
        if (allCommentsOfProduct.length > 0) {
          allCommentsOfProduct.forEach((comment) => {
            if (comment.rating) {
              totalRatingOfProduct += parseInt(comment.rating);
            }
          });
          totalRatingOfProduct = parseFloat(totalRatingOfProduct / allCommentsOfProduct.length);
        }
        if (totalRatingOfProduct !== 0) {
          await Product.findOneAndUpdate({_id: new ObjectId(req.params.productId)},
          {$set: {rating: totalRatingOfProduct}}).then((newProduct) => {
            return res.status(200).send(allCommentsOfProduct);
          });
        } else {
          await Product.findOneAndUpdate({_id: new ObjectId(req.params.productId)},
            {$set: {rating: null}}).then((newProduct) => {
              return res.status(200).send(allCommentsOfProduct);
            });
        }
      } else {
        return res.status(400).json({success: false, message: "You already commented for this product."});
      }
    }).catch((err) => {
      return res.status(400).json({success: false, message: "Not logged in."});
    });
};


exports.editComment = async (req,res) => {
  lib.fetchUserByToken(req)
  .then(async (user) => {
    if (user.role === 1) {
      await Comment.findOneAndUpdate({_id: new ObjectId(req.params.commentId), userId: new ObjectId(user._id)},
      {$set: {comment: req.body.comment, rating: parseInt(req.body.rating)}}).then(async (editedComment) => {
        var totalRatingOfProduct = 0;
        const allCommentsOfProduct = await Comment.find({productId: editedComment.productId});
        if (allCommentsOfProduct.length > 0) {
          allCommentsOfProduct.forEach((comment) => {
            totalRatingOfProduct += comment.rating;
          });
          totalRatingOfProduct = totalRatingOfProduct / allCommentsOfProduct.length;
        }
        if (totalRatingOfProduct !== 0) {
          await Product.findOneAndUpdate({_id: editedComment.productId},
          {$set: {rating: totalRatingOfProduct}}).then((newProduct) => {
            return res.status(200).send(allCommentsOfProduct);
          });
        } else {
          await Product.findOneAndUpdate({_id: deletedComment.productId},
            {$set: {rating: null}}).then((newProduct) => {
              return res.status(200).send(allCommentsOfProduct);
            });
        }
      }).catch((err) => {
        return res.status(400).json({success: false, message: err});
      });
    } else {
      await Comment.findOneAndUpdate({_id: new ObjectId(req.params.commentId)},
      {$set: {comment: req.body.comment, rating: parseInt(req.body.rating)}}).then(async (editedComment) => {
        var totalRatingOfProduct = 0;
        const allCommentsOfProduct = await Comment.find({productId: editedComment.productId});
        if (allCommentsOfProduct.length > 0) {
          allCommentsOfProduct.forEach((comment) => {
            totalRatingOfProduct += comment.rating;
          });
          totalRatingOfProduct = totalRatingOfProduct / allCommentsOfProduct.length;
        }
        if (totalRatingOfProduct !== 0) {
          await Product.findOneAndUpdate({_id: editedComment.productId},
          {$set: {rating: totalRatingOfProduct}}).then((newProduct) => {
            return res.status(200).send(allCommentsOfProduct);
          });
        } else {
          await Product.findOneAndUpdate({_id: deletedComment.productId},
            {$set: {rating: null}}).then((newProduct) => {
              return res.status(200).send(allCommentsOfProduct);
            });
        }
      }).catch((err) => {
        return res.status(400).json({success: false, message: err});
      });
    }
  }).catch((err) => {
    return res.status(400).json({success: false, message: err});
  });
};

exports.deleteComment = async (req,res) => {
  lib.fetchUserByToken(req)
  .then(async (user) => {
    if (user.role === 1) {
      await Comment.findOneAndDelete({_id: new ObjectId(req.params.commentId), userId: new ObjectId(user._id)}).then(async (deletedComment) => {
        var totalRatingOfProduct = 0;
        const allCommentsOfProduct = await Comment.find({productId: deletedComment.productId});
        if (allCommentsOfProduct.length !== 0) {
          allCommentsOfProduct.forEach((comment) => {
            totalRatingOfProduct += comment.rating;
          });
          totalRatingOfProduct = totalRatingOfProduct / allCommentsOfProduct.length;
        }
        if (totalRatingOfProduct > 0) {
          await Product.findOneAndUpdate({_id: deletedComment.productId},
          {$set: {rating: totalRatingOfProduct}}).then((newProduct) => {
            return res.status(200).send(allCommentsOfProduct);
          });
        } else {
          await Product.findOneAndUpdate({_id: deletedComment.productId},
            {$set: {rating: null}}).then((newProduct) => {
              return res.status(200).send(allCommentsOfProduct);
            });
        }
      }).catch((err) => {
        return res.status(400).json({success: false, message: err});
      });
    } else {
      await Comment.findOneAndDelete({_id: new ObjectId(req.params.commentId) }).then(async (deletedComment) => {
        var totalRatingOfProduct = 0;
        const allCommentsOfProduct = await Comment.find({productId: deletedComment.productId});
        if (allCommentsOfProduct.length !== 0) {
          allCommentsOfProduct.forEach((comment) => {
            totalRatingOfProduct += comment.rating;
          });
          totalRatingOfProduct = totalRatingOfProduct / allCommentsOfProduct.length;
        }
        if (totalRatingOfProduct > 0) {
          await Product.findOneAndUpdate({_id: deletedComment.productId},
          {$set: {rating: totalRatingOfProduct}}).then((newProduct) => {
            return res.status(200).send(allCommentsOfProduct);
          });
        } else {
          await Product.findOneAndUpdate({_id: deletedComment.productId},
            {$set: {rating: null}}).then((newProduct) => {
              return res.status(200).send(allCommentsOfProduct);
            });
        }
      }).catch((err) => {
        return res.status(400).json({success: false, message: err});
      });
    }
  }).catch((err) => {
    return res.status(400).json({success: false, message: "This comment isn't from you or you are not admin."});
  });
};