const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: { type: String, unique: false },
  email: { type: String, unique: false },
  authUid: { type: String, unique: true },
  verified: { type: Boolean, unique: false },
  role: { type: String, unique: false },
  status: { type: Boolean, unique: false },
  timestamp: { type: Date, unique: false },
});

const users = mongoose.model("user", user_schema);
exports.users = users;
