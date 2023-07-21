const user_model = require("../schemas/usersSchema").users;

exports.getUsers = async (req, res, next) => {
  try {
    const users = await user_model.find();
    // console.log(users);

    if (users) {
      res.json({
        success: true,
        message: "Users fetched successfully",
        users,
      });
    } else {
      res.json({ success: false, message: "Users not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const { sellerId } = req.query;
    const users = await user_model.find({ sellerId: sellerId });
    // console.log(users);

    if (users) {
      res.json({
        success: true,
        message: "Users fetched successfully",
        users,
      });
    } else {
      res.json({ success: false, message: "Users not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.getUser = async (req, res, next) => {
  console.log("uid", req.query.id);
  try {
    const user = await user_model.findOne({ authUid: req.query.id });
    // console.log("userinfo", user);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { username, email, authUid, verified, role } = req.body;

    // console.log("edit user", req.body);

    const user = await user_model.findOne({ authUid: req.query.id });

    console.log(user);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.authUid = authUid || user.authUid;
      user.verified = verified || user.verified;
      user.role = role || user.role;
      user.timestamp = new Date().toISOString();

      const result = await user.save();
      console.log(result);

      if (result) {
        res.json({
          success: true,
          message: "User updated successfully",
          result,
        });
      } else {
        res.json({ success: false, message: "User updating failed" });
      }
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const user = await user_model.findById(req.query.id);

    console.log(user);

    if (user) {
      user.status = status;
      user.timestamp = new Date().toISOString();

      const result = await user.save();
      console.log(result);

      if (result) {
        res.json({
          success: true,
          message: "User updated successfully",
          result,
        });
      } else {
        res.json({ success: false, message: "User updating failed" });
      }
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.createUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, authUid } = req.body;

    const user = new user_model({
      username,
      email,
      authUid,
      verified: false,
      status: true,
      role: "Admin",
      timestamp: new Date().toISOString(),
    });

    const result = await user.save();
    console.log(result);

    if (result) {
      res.json({
        success: true,
        message: "User created successfully",
        result,
      });
    } else {
      res.json({ success: false, message: "Customer creation failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};
exports.createEmployee = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, authUid, sellerId } = req.body;

    const user = new user_model({
      username,
      email,
      authUid,
      sellerId,
      verified: false,
      role: "Moderator",
      status: false,
      timestamp: new Date().toISOString(),
    });

    const result = await user.save();
    console.log(result);

    if (result) {
      res.json({
        success: true,
        message: "User created successfully",
        result,
      });
    } else {
      res.json({ success: false, message: "Customer creation failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.query.id;
    const user = await user_model.findById(userId);

    if (user) {
      await user.deleteOne();
      res.json({ success: true, message: "User deleted successfully" });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};
