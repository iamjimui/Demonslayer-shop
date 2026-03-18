const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  comment: {
    type: String,
    required: true,
    default: ""
  },
  rating: {
    type: Number,
    default: null
  },
  created_at: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Comment', CommentSchema);

