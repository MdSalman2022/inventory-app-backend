const supplier_model = require("../schemas/supplierSchema").supplier;

exports.getSupplier = async (req, res, next) => {
  try {
    const { sellerId } = req.query;

    let query = { sellerId: sellerId };

    const supplier = await supplier_model.find(query);

    if (supplier.length > 0) {
      res.json({ success: true, supplier });
    } else {
      res.json({ success: false, message: "No supplier found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createSupplier = async (req, res, next) => {
  try {
    const { name, sellerId, phone, address, status, timestamp } = req.body;

    const supplier = new supplier_model({
      name,
      sellerId,
      phone,
      address,
      status,
      timestamp,
    });

    const result = await supplier.save();

    if (result) {
      res.json({
        success: true,
        message: "Supplier created successfully",
        result,
      });
    }
  } catch (exception) {
    console.log(exception);
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.query;

    const { name, sellerId, phone, address, status, timestamp } = req.body;

    const query = { _id: id };

    const update = {
      name,
      sellerId,
      phone,
      address,
      status,
      timestamp,
    };

    const options = { new: true };

    const result = await supplier_model.findOneAndUpdate(
      query,
      update,
      options
    );

    if (result) {
      res.json({
        success: true,
        message: "Supplier updated successfully",
        result,
      });
    }
  } catch (exception) {
    console.log(exception);
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.query;

    const query = { _id: id };

    const result = await supplier_model.findOneAndDelete(query);

    if (result) {
      res.json({
        success: true,
        message: "Supplier deleted successfully",
        result,
      });
    }
  } catch (exception) {
    console.log(exception);
  }
};
