const express = require("express");
const employeeController = require("../controllers/employeeController");
const router = express.Router();

router.get("/get-employee", employeeController.getEmployee);
router.post("/create-employee", employeeController.createEmployee);
router.put("/update-employee", employeeController.updateEmployee);
router.delete("/delete-employee", employeeController.deleteEmployee);

module.exports = router;
