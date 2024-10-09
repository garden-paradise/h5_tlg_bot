const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productImage: String,
  taste: String,
  name: String,
  price: Number,
});

module.exports = mongoose.model('ProductTelegram', productSchema);
