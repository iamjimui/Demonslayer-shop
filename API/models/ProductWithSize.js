const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductWithSizeSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productSizeId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('ProductWithSize', ProductWithSizeSchema);
