const express = require("express");

const router = express.Router();

// import middleware
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { register, login } = require("../controllers/user");


router.post("/register", register);
router.post("/login", login);


module.exports = router;