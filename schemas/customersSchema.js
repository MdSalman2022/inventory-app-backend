const mongoose = require("mongoose");

const customer_schema = new mongoose.Schema({
  customer_details: {
    name: { type: String, unique: false },
    image: { type: String, unique: false },
    phone: { type: String, unique: false },
    location: { type: String, unique: false },

    address: { type: String, unique: false },
    link: { type: String, unique: false },
  },
  purchase: {
    total: { type: Number, unique: false },
    last_purchase: { type: Date, unique: false },
  },
  orders: {
    processing: { type: Number, unique: false },
    ready: { type: Number, unique: false },
    completed: { type: Number, unique: false },
    returned: { type: Number, unique: false },
    cancelled: { type: Number, unique: false },
  },
  sellerId: { type: String, unique: false },
  storeId: { type: Array, unique: false },
  timestamp: { type: Date, unique: false },
});

const customers = mongoose.model("customer", customer_schema);
exports.customers = customers;
