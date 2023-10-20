const order_model = require("../schemas/ordersSchema").orders;
const { Parser } = require("json2csv");

exports.getOrdersByFilter = async (req, res, next) => {
  try {
    const { filter, courier, courierStatus, sellerId, page, limit } = req.query;
    let filterOptions = { sellerId: sellerId };

    if (filter === "all") {
      filterOptions.orderStatus = {
        $in: ["processing", "ready", "completed", "returned", "cancelled"],
      };
    }
    if (filter !== "all") {
      filterOptions.orderStatus = filter;
    }
    if (courier) {
      filterOptions.courier = courier;
    }
    if (courierStatus) {
      filterOptions.courierStatus = courierStatus;
    }
    const sortOptions = courierStatus
      ? { "courierInfo.consignment.created_at": -1 }
      : { timestamp: -1 };

    const orders = await order_model
      .find(filterOptions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalOrders = await order_model.countDocuments(filterOptions);

    if (orders.length > 0) {
      res.json({
        success: true,
        orders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page),
      });
    } else {
      res.json({ success: false, message: "No orders found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.searchOrder = async (req, res, next) => {
  try {
    const { orderId, sellerId } = req.query;

    const orders = await order_model.find({
      orderId: orderId,
      sellerId: sellerId,
    });

    if (orders.length > 0) {
      res.json({ success: true, orders });
    } else {
      res.json({ success: false, message: "No order found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
  }
};
exports.searchOrderByName = async (req, res, next) => {
  try {
    const { name, sellerId } = req.query;
    const searchRegex = new RegExp(`.*${name}.*`, "i");

    const searchQuery = {
      sellerId: sellerId,
      name: searchRegex,
    };

    console.log(searchQuery);

    const orders = await order_model.find(searchQuery);

    // console.log(orders);

    if (orders.length > 0) {
      res.json({ success: true, orders });
    } else {
      res.json({ success: false, message: "No order found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getOrdersByCustomerId = async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log(id);
    const orders = await order_model.find({ customerId: id });

    if (orders.length > 0) {
      res.json({
        success: true,
        orders,
        processing: orders.filter((item) => item.orderStatus === "processing"),
        ready: orders.filter((item) => item.orderStatus === "ready"),
        completed: orders.filter((item) => item.orderStatus === "completed"),
        returned: orders.filter((item) => item.orderStatus === "returned"),
        cancelled: orders.filter((item) => item.orderStatus === "cancelled"),
      });
    } else {
      res.json({ success: false, message: "No orders found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};
exports.exportOrders = async (req, res, next) => {
  try {
    const { orderIds } = req.query;

    const filterOptions = {
      _id: { $in: orderIds.split(",") }, // Split and convert to an array
    };

    console.log("my filter ", filterOptions);

    const orders = await order_model.find(filterOptions);

    console.log("orders ", orders);

    if (orders.length === 0) {
      return res.json({ success: false, message: "No orders found" });
    }

    function formatStockDate(isoTimestamp) {
      const date = new Date(isoTimestamp);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });

      return formattedDate;
    }

    const flattenedData = orders.map((item) => ({
      _id: item._id,
      orderId: item.orderId,
      image: item.image,
      name: item.name,
      phone: item.phone,
      address: item.address,
      district: item.district,
      products: item.products,
      quantity: item.quantity,
      courier: item.courier,
      deliveryCharge: item.deliveryCharge,
      discount: item.discount,
      total: item.total,
      advance: item.advance,
      cash: item.cash,
      instruction: item.instruction,
      orderStatus: "processing",
      timestamp: formatStockDate(item.timestamp),
    }));

    const filename = "order_list.csv";

    const { Parser } = require("json2csv");
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(flattenedData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.send(csvData);
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createOrder = async (req, res, next) => {
  // console.log(req.body);
  try {
    const {
      customerId,
      image,
      name,
      phone,
      refNo,
      paymentType,
      address,
      district,
      thana,
      sellerId,
      store,
      storeId,
      products,
      quantity,
      courier,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction,
      createdBy,
      createdById,
      salesDate,
    } = req.body;

    // console.log("store", store);

    /*     const lastOrder = await order_model.findOne(
      {},
      {},
      { sort: { timestamp: -1 } }
    ); */
    // let lastOrderId = lastOrder ? parseInt(lastOrder.orderId) : 0;
    // const orderId = String(lastOrderId + 1).padStart(10, "0");
    const lastOrder = await order_model.findOne(
      {},
      {},
      { sort: { timestamp: -1 } }
    );
    let lastOrderId = lastOrder ? parseInt(lastOrder.orderId) : 0;

    // Check if lastOrderId is less than 1000 (or any other starting value you prefer)
    if (lastOrderId < 1000) {
      lastOrderId = 1000;
    } else {
      lastOrderId += 1;
    }

    const order = new order_model({
      orderId: lastOrderId,
      customerId,
      image,
      name,
      phone,
      refNo,
      paymentType,
      address,
      district,
      thana,
      sellerId: sellerId,
      store,
      storeId: storeId,
      products,
      quantity,
      courier,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction,
      createdBy,
      createdById,
      orderStatus: "processing",
      salesDate,
      timestamp: new Date(),
    });

    // console.log(order);

    const result = await order.save();

    if (result) {
      res.json({
        success: true,
        message: "Order created successfully",
        orderId: order.orderId,
      });
    } else {
      res.json({ success: false, message: "Order creation failed" });
    }
  } catch (exception) {
    console.error("Exception occurred in creating order:", exception);
  }
};

exports.editOrderInfo = async (req, res, next) => {
  try {
    const {
      orderId,
      image,
      name,
      phone,
      address,
      district,
      thana,
      products,
      quantity,
      courier,
      storeId,
      store,
      courierStatus,
      courierInfo,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction,
      orderStatus,
      updatedBy,
      updatedById,
      update,
    } = req.body;

    const order = await order_model.findById(req.query.id);

    updatedInfo = {
      update: update || order.update,
      updatedBy: updatedBy || order.updatedBy,
      updatedById: updatedById || order.updatedById,
      timestamp: new Date(),
    };

    if (order) {
      order.orderId = orderId || order.orderId;
      order.image = image || order.image;
      order.name = name || order.name;
      order.phone = phone || order.phone;
      order.address = address || order.address;
      order.district = district || order.district;
      order.thana = thana || order.thana;
      order.products = products || order.products;
      order.quantity = quantity || order.quantity;
      order.storeId = storeId || order.storeId;
      order.store = store || order.store;
      order.courier = courier || order.courier;
      order.courierStatus = courierStatus || order.courierStatus;
      order.courierInfo = courierInfo || order.courierInfo;
      order.deliveryCharge = deliveryCharge || order.deliveryCharge;
      order.discount = discount || order.discount;
      order.total = total || order.total;
      order.advance = advance || order.advance;
      order.cash = cash || order.cash;
      order.instruction = instruction || order.instruction;
      order.orderStatus = orderStatus || order.orderStatus;
      order.updated.push(updatedInfo);

      const result = await order.save();

      if (result) {
        res.json({ success: true, message: "Order edited successfully" });
      } else {
        res.json({ success: false, message: "Order edit failed" });
      }
    } else {
      res.json({ success: false, message: "Order not found" });
    }
  } catch (exception) {
    console.error("Exception occurred in editing order:", exception);
  }
};

exports.orderStatusUpdateById = async (req, res, next) => {
  try {
    const orderId = req.query.id;
    const { update, updatedBy, updatedById, orderStatus } = req.body;
    const order = await order_model.findById(orderId);

    updatedInfo = {
      update: update || order.update,
      updatedBy: updatedBy || order.updatedBy,
      updatedById: updatedById || order.updatedById,
      timestamp: new Date(),
    };

    if (order) {
      order.orderStatus = orderStatus;
      order.updated.push(updatedInfo);
      const result = await order.save();
      if (result) {
        res.json({
          success: true,
          message: "Order status updated successfully",
          order,
        });
      } else {
        res.json({ success: false, message: "Order status update failed" });
      }
    } else {
      res.json({ success: false, message: "Order not found" });
    }
  } catch (exception) {
    console.error("Exception occurred in updating order status:", exception);
  }
};

exports.deleteOrderById = async (req, res, next) => {
  try {
    const orderId = req.query.id;
    console.log(orderId);
    const result = await order_model.findByIdAndDelete(orderId);
    console.log(result);
    if (result) {
      res.json({ success: true, message: "Order deleted successfully" });
    } else {
      res.json({ success: false, message: "Order deletion failed" });
    }
  } catch (exception) {
    console.error("Exception occurred in deleting order:", exception);
  }
};

exports.getNewOrderId = async (req, res, next) => {
  try {
    const lastOrder = await order_model.findOne(
      {},
      {},
      { sort: { timestamp: -1 } }
    );
    let lastOrderId = lastOrder ? parseInt(lastOrder.orderId) : 0;
    const orderId = String(lastOrderId + 1).padStart(10, "0");
    res.json({ success: true, orderId });
  } catch (exception) {
    console.error("Exception occurred in getting new order id:", exception);
  }
};
