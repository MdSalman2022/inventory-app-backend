const express = require("express");
const supplierController = require("../controllers/supplierController");
const router = express.Router();

router.get("/get-supplier", supplierController.getSupplier);
router.post("/create-supplier", supplierController.createSupplier);
router.put("/update-supplier", supplierController.updateSupplier);
router.delete("/delete-supplier", supplierController.deleteSupplier);

module.exports = router;
