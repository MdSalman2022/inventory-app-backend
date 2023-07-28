const courier_model = require("../schemas/couriersSchema").courier;

exports.getCouriers = async (req, res, next) => {
  try {
    const { sellerId } = req.query;

    const query = { sellerId: sellerId };

    const couriers = await courier_model.find(query);

    // console.log(couriers);
    if (couriers.length > 0) {
      res.json({ success: true, couriers });
    } else {
      res.json({ success: false, message: "No couriers found", couriers });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createCourier = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { name, chargeInDhaka, chargeOutsideDhaka, status, sellerId } =
      req.body;

    const courier = new courier_model({
      name,
      chargeInDhaka,
      chargeOutsideDhaka,
      status,
      sellerId,
      timestamp: new Date(),
    });

    const result = await courier.save();

    if (result) {
      res.json({ success: true, message: "Courier created successfully" });
    } else {
      res.json({ success: false, message: "Courier creation failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};
exports.editCourierInfo = async (req, res, next) => {
  try {
    const { name,api,secret, chargeInDhaka, chargeOutsideDhaka, status } = req.body;
    const courier = await courier_model.findById(req.query.id);

    console.log(courier);
    console.log(status);

    if (courier) {
      courier.name = name || courier.name;
      courier.api = api || courier.api;
      courier.secret = secret || courier.secret;
      courier.chargeInDhaka = chargeInDhaka || courier.chargeInDhaka;
      courier.chargeOutsideDhaka =
        chargeOutsideDhaka || courier.chargeOutsideDhaka;
      courier.updatedTimestamp = new Date();

      if (typeof status === "boolean") {
        courier.status = status;
      }

      const result = await courier.save();
      console.log(result);

      if (result) {
        res.json({ success: true, message: "Courier updated successfully" });
      } else {
        res.json({ success: false, message: "Courier update failed" });
      }
    } else {
      res.json({ success: false, message: "Courier not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.deleteCourier = async (req, res, next) => {
  try {
    const { id } = req.query;

    const result = await courier_model.findByIdAndDelete(id);

    if (result) {
      res.json({ success: true, message: "Courier deleted successfully" });
    } else {
      res.json({ success: false, message: "Courier deletion failed" });
    }
  } catch (exception) {
    console.log(exception);
  }
};
