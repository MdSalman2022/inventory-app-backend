const express = require("express");
const ordersController = require("../controllers/ordersController");
const router = express.Router();

/* /api/order-export  export csv 
/api/get-orders/:filterBy 
/api/post-order
/api/post-orders - import csv 
/api/put-edit-order/:id
/api/put-update-order-status/:id 
/api/delete-order/:id */

router.get("/get-orders", ordersController.getOrdersByFilter);
router.get("/get-orders-by-customer", ordersController.getOrdersByCustomerId);
router.get("/order-export", ordersController.exportOrders);
router.post("/create-order", ordersController.createOrder);
router.put("/edit-order-info", ordersController.editOrderInfo);
router.put("/edit-order-status", ordersController.orderStatusUpdateById);
router.delete("/delete-order", ordersController.deleteOrderById);
router.get("/get-new-orderid", ordersController.getNewOrderId);

module.exports = router;
