const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get("/get-users", usersController.getUsers);
router.get("/get-employees", usersController.getEmployees);
router.get("/get-user", usersController.getUser);
router.post("/create-user", usersController.createUser);
router.post("/create-employee", usersController.createEmployee);
router.put("/edit-user", usersController.editUser);
router.put("/update-status", usersController.updateStatus);
router.delete("/delete-user", usersController.deleteUser);
module.exports = router;
