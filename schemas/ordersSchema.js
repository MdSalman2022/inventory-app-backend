const mongoose = require("mongoose");

const updated_schema = new mongoose.Schema({
  update: { type: Object, unique: false },
  updatedBy: { type: String, unique: false },
  updatedById: { type: String, unique: false },
  timestamp: { type: Date, unique: false },
});

const order_schema = new mongoose.Schema({
  customerId: { type: String, unique: false },
  orderId: { type: String, unique: false },
  name: { type: String, unique: false },
  phone: { type: String, unique: false },
  address: { type: String, unique: false },
  image: { type: String, unique: false },
  district: { type: String, unique: false },
  sellerId: { type: String, unique: false },
  store: { type: Object, unique: false },
  storeId: { type: String, unique: false },
  createdBy: { type: String, unique: false },
  createdById: { type: String, unique: false },
  updated: [updated_schema],
  products: { type: Array, unique: false },
  quantity: { type: Number, unique: false },
  courier: { type: String, unique: false },
  courierStatus: { type: String, unique: false },
  courierInfo: { type: Object, unique: false },
  deliveryCharge: { type: Number, unique: false },
  discount: { type: Number, unique: false },
  total: { type: Number, unique: false },
  advance: { type: Number, unique: false },
  cash: { type: Number, unique: false },
  instruction: { type: String, unique: false },
  orderStatus: { type: String, unique: false },
  timestamp: { type: Date, unique: false },
});

const orders = mongoose.model("order", order_schema);
exports.orders = orders;
