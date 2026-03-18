const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
    minimum : 0
  },
  created_at: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('Order', OrderSchema);

