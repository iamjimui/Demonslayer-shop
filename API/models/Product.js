const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productTypeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    default: null
  },
  price: {
    type: Number,
    required: true,
    minimum : 0
  },
  image: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Product', ProductSchema);