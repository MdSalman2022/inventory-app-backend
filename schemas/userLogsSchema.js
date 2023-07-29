const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  userId: { type: String, unique: false },
  logs: [
    {
      logType: { type: String, unique: false },
      logMessage: { type: String, unique: false },
      timestamp: { type: Date, unique: false },
    },
  ],
  timestamp: { type: Date, unique: false },
});

const userslog = mongoose.model("userlog", user_schema);
exports.userslog = userslog;
