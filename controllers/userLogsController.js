const userlogs_model = require("../schemas/userLogsSchema").userslog;

exports.getLogs = async (req, res, next) => {
  try {
    const result = await userlogs_model.findOne({
      userId: req.query.id,
    });
    console.log(result);
    if (result) {
      res.json({
        success: true,
        message: "User logs fetched successfully",
        result,
      });
    } else {
      res.json({ success: false, message: "User logs fetch failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.createLog = async (req, res, next) => {
  console.log(req.body);
  try {
    const { userId } = req.body;

    const user = new userlogs_model({
      userId,
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

exports.editLog = async (req, res, next) => {
  try {
    const { logType, logMessage } = req.body;

    console.log("user id ", req.query.id);

    const userlog = await userlogs_model.findOne({
      userId: req.query.id,
    });

    console.log("userlog ", userlog);

    logsInfo = {
      logType: logType,
      logMessage: logMessage,
      timestamp: new Date(),
    };

    console.log("loginfo", logsInfo);

    if (userlog) {
      // Push the new logsInfo into the logs array
      userlog.logs.push(logsInfo);

      const result = await userlog.save(); // Save the userlog after pushing the new logsInfo

      if (result) {
        console.log("result success");
        res.json({
          success: true,
          message: "User log updated successfully",
          result,
        });
      } else {
        console.log("result failed");
        res.json({
          success: false,
          message: "User log updating failed",
        });
      }
    } else {
      res.json({
        success: false,
        message: "User log not found",
      });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};
