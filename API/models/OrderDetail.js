const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderDetailSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  product: {
    type: Object,
    required: true
  },
  productSize: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    minimum : 1
  },
  price: {
    type: Number,
    required:true,
    minimum : 0
  }
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
