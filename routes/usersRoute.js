const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get("/get-users", usersController.getUsers);
router.get("/get-user", usersController.getUser);
router.post("/create-user", usersController.createUser);
router.put("/edit-user", usersController.editUser);
module.exports = router;
