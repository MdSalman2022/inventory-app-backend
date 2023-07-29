const express = require("express");
const userLogsController = require("../controllers/userLogsController");
const router = express.Router();

router.get("/get-logs", userLogsController.getLogs);
router.post("/create-log", userLogsController.createLog);
router.put("/edit-log", userLogsController.editLog);

module.exports = router;
