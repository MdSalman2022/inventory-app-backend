const mongoose = require("mongoose");

const courier_schema = new mongoose.Schema({
  name: { type: String, unique: false },
  chargeInDhaka: { type: Number, unique: false },
  chargeOutsideDhaka: { type: Number, unique: false },
  status: { type: Boolean, unique: false },
  updatedTimestamp: { type: Date, unique: false },
  timestamp: { type: Date, unique: false },
});

const courier = mongoose.model("courier", courier_schema);
exports.courier = courier;
