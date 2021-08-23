// express
const express = require("express");

// controllers
const { signup } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
module.exports = router;
