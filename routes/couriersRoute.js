const path = require("path");
const express = require("express");
const couriersController = require("../controllers/couriersController");
const router = express.Router();

/* /api/get-couriers 
/api/post-add-courier 
/api/put-edit-courier-info/:id  */

router.get("/get-couriers", couriersController.getCouriers);
router.post("/create-courier", couriersController.createCourier);
router.put("/edit-courier-info", couriersController.editCourierInfo);
router.delete("/delete-courier", couriersController.deleteCourier);

module.exports = router;
