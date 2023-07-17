const mongoose = require("mongoose");

const supplier_schema = new mongoose.Schema({
  name: { type: String, unique: false },
  sellerId: { type: String, unique: false },
  phone: { type: String, unique: false },
  address: { type: String, unique: false },
  status: { type: Boolean, unique: false },
  timestamp: { type: Date },
});

const supplier = mongoose.model("supplier", supplier_schema);
exports.supplier = supplier;
