const mongoose = require("mongoose");

const product_schema = new mongoose.Schema({
  image: { type: String, unique: false },
  name: { type: String, unique: false },
  description: { type: String, unique: false },
  brand: { type: String, unique: false },
  supplier: { type: String, unique: false },
  country: { type: String, unique: false },
  store: { type: String, unique: false },
  liftPrice: { type: Number, unique: false },
  salePrice: { type: Number, unique: false },
  qty: { type: Number, unique: false },
  availableQty: { type: Number, unique: false },
  timestamp: { type: Date, unique: false },
});

const products = mongoose.model("product", product_schema);
exports.products = products;
