const express = require("express");
const controller = require("../controllers/user-controller");

const router = express.Router();

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);

module.exports = router;
