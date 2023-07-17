const order_model = require("../schemas/ordersSchema").orders;
const { Parser } = require("json2csv");

exports.getOrdersByFilter = async (req, res, next) => {
  try {
    const { filter, courier, courierStatus, sellerid } = req.query;
    let filterOptions = { sellerId: sellerid };

    if (filter !== "all") {
      filterOptions.orderStatus = filter;
    }
    if (courier) {
      filterOptions.courier = courier;
    }
    if (courierStatus) {
      filterOptions.courierStatus = courierStatus;
    }

    const orders = await order_model.find(filterOptions);

    if (orders.length > 0) {
      res.json({ success: true, orders });
    } else {
      res.json({ success: false, message: "No orders found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
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
    const { sellerid } = req.query;
    let filterOptions = { sellerId: sellerid };

    const orders = await order_model.find(filterOptions);

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
    const filename = "customer_list.csv";

    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(flattenedData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    if (orders.length > 0) {
      res.send(csvData);
    } else {
      res.json({ success: false, message: "No customers found" });
    }
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
      address,
      district,
      sellerid,
      store,
      storeid,
      products,
      quantity,
      courier,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction,
    } = req.body;

    console.log("store", store);

    const lastOrder = await order_model.findOne(
      {},
      {},
      { sort: { timestamp: -1 } }
    );
    let lastOrderId = lastOrder ? parseInt(lastOrder.orderId) : 0;
    const orderId = String(lastOrderId + 1).padStart(10, "0");

    const order = new order_model({
      orderId,
      customerId,
      image,
      name,
      phone,
      address,
      district,
      sellerId: sellerid,
      store,
      storeId: storeid,
      products,
      quantity,
      courier,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction,
      orderStatus: "processing",
      timestamp: new Date(),
    });

    console.log(order);

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
      products,
      quantity,
      courier,
      storeid,
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
    } = req.body;

    const order = await order_model.findById(req.query.id);

    if (order) {
      order.orderId = orderId || order.orderId;
      order.image = image || order.image;
      order.name = name || order.name;
      order.phone = phone || order.phone;
      order.address = address || order.address;
      order.district = district || order.district;
      order.products = products || order.products;
      order.quantity = quantity || order.quantity;
      order.storeId = storeid || order.storeId;
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
    const orderStatus = req.body.orderStatus;
    const order = await order_model.findById(orderId);
    if (order) {
      order.orderStatus = orderStatus;
      const result = await order.save();
      if (result) {
        res.json({
          success: true,
          message: "Order status updated successfully",
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
