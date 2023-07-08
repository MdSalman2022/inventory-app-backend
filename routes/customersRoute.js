const express = require("express");
const customersController = require("../controllers/customersController");
const router = express.Router();

/* /api/get-customers 
/api/search-customer
/api/add-customer 
/api/put-edit-customer/:id 
/api/delete-customer/:id  
/api/customer-export */

router.get("/get-customers", customersController.getCustomers);
router.get("/customer-export", customersController.exportCustomers);
router.get("/search-customer", customersController.getCustomerByNameOrPhone);
router.get("/get-customer-by-id", customersController.getCustomerById);
router.post("/create-customer", customersController.createCustomer);
router.put("/edit-customer-info", customersController.editCustomerInfo);
router.delete("/delete-customer", customersController.deleteCustomer);

module.exports = router;
