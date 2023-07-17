const mongoose = require("mongoose");

const employee_schema = new mongoose.Schema({
  username: { type: String, unique: false },
  email: { type: String, unique: false },
  password: { type: String, unique: false },
  sellerId: { type: String, unique: false },
  status: { type: Boolean, unique: false },
  role: { type: String, unique: false },
  timestamp: { type: Date, unique: false },
});

const employee = mongoose.model("employee", employee_schema);
exports.employee = employee;
