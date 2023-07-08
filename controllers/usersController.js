const user_model = require("../schemas/usersSchema").users;

exports.getUsers = async (req, res, next) => {
  try {
    const users = await user_model.find();
    console.log(users);

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

exports.getUser = async (req, res, next) => {
  try {
    const user = await user_model.findOne({ authUid: req.query.id });

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
    const { username, email, authUid, verified } = req.body;

    const user = await user_model.findOne({ authUid: req.query.id });

    if (user) {
      const result = await customer.save();

      if (result) {
        res.json({ success: true, message: "Customer updated successfully" });
      } else {
        res.json({ success: false, message: "Customer update failed" });
      }
    } else {
      res.json({ success: false, message: "Customer not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
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
