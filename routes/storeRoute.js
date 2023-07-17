const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

router.get("/get-stores", storeController.getStores);
router.get("/get-store-by-id", storeController.getStoreById);
router.get("/get-stores-by-owner-id", storeController.getStoresBySellerId);
router.post("/create-store", storeController.createStore);
router.put("/edit-store", storeController.editStore);
router.put("/update-store-status", storeController.updateStoreStatus);
router.put("/update-store-employees", storeController.updateStoreEmployees);
router.put("/update-store-owner-info", storeController.updateStoresellerInfo);
router.delete("/delete-store", storeController.deleteStore);

module.exports = router;
