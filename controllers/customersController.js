const customer_model = require("../schemas/customersSchema").customers;
const { Parser } = require("json2csv");

exports.getCustomers = async (req, res, next) => {
  try {
    const { sellerId, storeId } = req.query;

    let query = { sellerId: sellerId };

    if (storeId) {
      query.storeId = storeId;
    }

    const customers = await customer_model.find(query);

    console.log("customers", customers);

    if (customers.length > 0) {
      res.json({ success: true, message: "Customers found", customers });
    } else {
      res.json({ success: false, message: "No customers found", customers });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.exportCustomers = async (req, res, next) => {
  try {
    const { sellerId, storeId } = req.query;

    let query = { sellerId: sellerId };

    if (storeId) {
      query.storeId = storeId;
    }

    const customers = await customer_model.find(query);

    const flattenedData = customers.map((item) => ({
      _id: item._id,
      customer_name: item.customer_details.name,
      customer_phone: item.customer_details.phone,
      customer_location: item.customer_details.location,
      customer_address: item.customer_details.address,
      purchase_total: item.purchase.total,
      orders_processing: item.orders.processing,
      orders_ready: item.orders.ready,
      orders_completed: item.orders.completed,
      orders_returned: item.orders.returned,
    }));
    const filename = "customer_list.csv";

    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(flattenedData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    if (customers.length > 0) {
      res.send(csvData);
    } else {
      res.json({ success: false, message: "No customers found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createCustomer = async (req, res, next) => {
  console.log("new customer ", req.body);
  try {
    const { name, image, phone, location, thana, address, link, sellerId } =
      req.body;

    const customer = new customer_model({
      customer_details: {
        name,
        image,
        phone,
        location,
        address,
        thana,
        link,
      },
      purchase: {
        total: 0,
        last_purchase: null,
      },
      orders: {
        processing: 0,
        ready: 0,
        completed: 0,
        returned: 0,
      },
      sellerId: sellerId,
      timestamp: new Date().toISOString(),
    });

    const result = await customer.save();
    console.log("customer result", result);

    if (result) {
      res.json({
        success: true,
        message: "Customer created successfully",
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

exports.editCustomerInfo = async (req, res, next) => {
  try {
    const {
      image,
      name,
      phone,
      location,
      thana,
      address,
      link,
      total,
      order,
      storeId,
      processingCount,
      readyCount,
      completedCount,
      returnedCount,
    } = req.body;

    console.log("edit customer ", req.body);
    console.log("STORE ID", storeId);

    const customer = await customer_model.findById(req.query.id);

    if (customer) {
      customer.customer_details.name = name || customer.customer_details.name;
      customer.customer_details.image =
        image || customer.customer_details.image;
      customer.customer_details.phone =
        phone || customer.customer_details.phone;
      customer.customer_details.location =
        location || customer.customer_details.location;
      customer.customer_details.thana =
        thana || customer.customer_details.thana;
      customer.customer_details.address =
        address || customer.customer_details.address;
      customer.customer_details.link = link || customer.customer_details.link;

      customer.purchase.total = total || customer.purchase.total;
      customer.purchase.last_purchase =
        new Date().toISOString() || customer.purchase.last_purchase;
      if (!customer.storeId.includes(storeId)) {
        customer.storeId.push(storeId);
      }

      // Ensure customer.storeId is initialized as an array
      customer.storeId = customer.storeId || [];

      customer.orders.processing =
        processingCount || customer.orders.processing;
      customer.orders.ready = readyCount || customer.orders.ready;
      customer.orders.completed = completedCount || customer.orders.completed;
      customer.orders.returned = returnedCount || customer.orders.returned;

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

exports.updateOrderCount = async (req, res, next) => {
  try {
    const {
      processingCount,
      readyCount,
      completedCount,
      returnedCount,
      cancelledCount,
    } = req.body;

    const customer = await customer_model.findById(req.query.id);

    console.log("order count by customer update");

    if (customer) {
      if (processingCount) {
        customer.orders.processing += 1;
        customer.orders.ready -= 1;
      } else if (readyCount) {
        customer.orders.processing -= 1;
        customer.orders.ready += 1;
      } else if (completedCount) {
        customer.orders.ready -= 1;
        customer.orders.completed += 1;
      } else if (returnedCount) {
        customer.orders.completed -= 1;
        customer.orders.returned += 1;
      } else if (cancelledCount) {
        customer.orders.ready -= 1;
        customer.orders.cancelled += 1;
      }
    }

    const result = await customer.save();

    if (result) {
      res.json({ success: true, message: "Customer updated successfully" });
    } else {
      res.json({ success: false, message: "Customer update failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.query.id;
    const customer = await customer_model.findById(customerId);

    if (customer) {
      await customer.deleteOne();
      res.json({ success: true, message: "Customer deleted successfully" });
    } else {
      res.json({ success: false, message: "Customer not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};

exports.getCustomerByNameOrPhone = async (req, res, next) => {
  try {
    const { name, phonenumber, sellerId } = req.query;

    let searchQuery = { sellerId: sellerId };

    if (phonenumber) {
      // Search by phone number
      searchQuery["customer_details.phone"] = phonenumber;
    }

    if (name) {
      // Search by name (partial match)
      searchQuery["customer_details.name"] = { $regex: name, $options: "i" };
    }

    if (!phonenumber && !name) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid search query" });
    }

    const pipeline = [
      {
        $match: searchQuery,
      },
      {
        $limit: 50, // Limit the number of search results
      },
    ];

    const customers = await customer_model.aggregate(pipeline);

    console.log(customers);
    if (customers.length > 0) {
      res.json({ success: true, customers });
    } else {
      res.json({ success: false, message: "Customers not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.json({ success: false, message: "An error occurred" });
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await customer_model.findById(req.query.id);

    if (customer) {
      res.json({ success: true, customer });
    } else {
      res.json({ success: false, message: "Customer not found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};
