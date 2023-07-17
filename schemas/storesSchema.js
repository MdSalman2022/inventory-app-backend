const mongoose = require("mongoose");

const store_schema = new mongoose.Schema({
  name: { type: String, unique: false },
  storeId: { type: String, unique: false },
  sellerId: { type: String, unique: false },
  sellerInfo: { type: Object, unique: false },
  address: { type: String, unique: false },
  phone: { type: String, unique: false },
  district: { type: String, unique: false },
  employees: { type: Array, unique: false },
  area: { type: String, unique: false },
  zip: { type: String, unique: false },
  status: { type: Boolean, unique: false },
  steadfast_api_key: { type: String, unique: false },
  steadfast_api_secret: { type: String, unique: false },
  timestamp: { type: Date },
});

const stores = mongoose.model("store", store_schema);
exports.stores = stores;
