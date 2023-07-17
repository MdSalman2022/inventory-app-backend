const store_model = require("../schemas/storesSchema").stores;

exports.getStores = async (req, res, next) => {
  try {
    const stores = await store_model.find();

    if (stores.length > 0) {
      res.json({ success: true, stores });
    } else {
      res.json({ success: false, message: "No stores found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.getStoreById = async (req, res, next) => {
  try {
    const { id } = req.query;
    const store = await store_model.findById(id);

    if (store) {
      res.json({ success: true, store });
    } else {
      res.json({ success: false, message: "No store found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.getStoresBySellerId = async (req, res, next) => {
  try {
    const { id } = req.query;

    const stores = await store_model.find({ sellerId: id });

    // console.log("stores ", stores);
    if (stores.length > 0) {
      res.json({ success: true, stores });
    } else {
      res.json({ success: false, message: "No stores found", stores: [] });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.createStore = async (req, res, next) => {
  const generateStoreId = () => {
    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // console.log(generateStoreId());
  try {
    const {
      name,
      address,
      phone,
      district,
      sellerId,
      sellerInfo,
      area,
      zip,
      status,
    } = req.body;
    const store = new store_model({
      name,
      storeId: generateStoreId(),
      sellerId: sellerId,
      sellerInfo,
      address,
      phone,
      district,
      area,
      zip,
      status,
      timestamp: Date.now(),
    });
    const result = await store.save();
    res.json({ success: true, store: result });
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.editStore = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { name, address, phone, district, area, zip, status, api, secret } =
      req.body;
    const result = await store_model.findByIdAndUpdate(id, {
      name,
      address,
      phone,
      district,
      area,
      zip,
      status,
      steadfast_api_key: api,
      steadfast_api_secret: secret,
      timestamp: Date.now(),
    });
    // console.log(result);
    res.json({ success: true, store: result });
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.updateStoreStatus = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { status } = req.body;

    const result = await store_model.findByIdAndUpdate(id, {
      status,
      timestamp: Date.now(),
    });
    res.json({ success: true, store: result });
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.updateStoreEmployees = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { employeeId } = req.body;

    const result = await store_model.findByIdAndUpdate(id, {
      $push: { employees: employeeId },
      timestamp: Date.now(),
    });
    res.json({ success: true, store: result });
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.updateStoresellerInfo = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { username, email } = req.body;
    const result = await store_model.findByIdAndUpdate(id, {
      sellerInfo: { username, email },
      timestamp: Date.now(),
    });
    res.json({ success: true, store: result });
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const { id } = req.query;
    const result = await store_model.findByIdAndDelete(id);
    res.json({ success: true, store: result });
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};
