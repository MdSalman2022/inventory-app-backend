const customer_model = require("../schemas/customersSchema").customers;

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await customer_model.find();

    // console.log(customers);
    if (customers.length > 0) {
      res.json({ success: true, customers });
    } else {
      res.json({ success: false, message: "No customers found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createCustomer = async (req, res, next) => {
  console.log(req.body);
  try {
    const { name, image, phone, location, address, link } = req.body;

    const customer = new customer_model({
      customer_details: {
        name,
        image,
        phone,
        location,
        address,
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
      timestamp: new Date().toISOString(),
    });

    const result = await customer.save();
    console.log(result);

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
      address,
      link,
      total,
      order,
      processingCount,
      readyCount,
      completedCount,
      returnedCount,
    } = req.body;

    const customer = await customer_model.findById(req.query.id);

    if (customer) {
      customer.customer_details.name = name || customer.customer_details.name;
      customer.customer_details.image =
        image || customer.customer_details.image;
      customer.customer_details.phone =
        phone || customer.customer_details.phone;
      customer.customer_details.location =
        location || customer.customer_details.location;
      customer.customer_details.address =
        address || customer.customer_details.address;
      customer.customer_details.link = link || customer.customer_details.link;

      customer.purchase.total = total || customer.purchase.total;
      customer.purchase.last_purchase =
        new Date().toISOString() || customer.purchase.last_purchase;

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
    const { name, phonenumber } = req.query;

    let searchQuery;
    console.log(name);

    if (phonenumber) {
      // Search by phone number
      searchQuery = { "customer_details.phone": phonenumber };
    } else if (name) {
      // Search by name (partial match)
      searchQuery = {
        "customer_details.name": { $regex: name, $options: "i" },
      };
    } else {
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
