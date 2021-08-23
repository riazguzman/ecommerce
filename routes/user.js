// express
const express = require("express");

// controllers
const { user } = require("../controllers/userController");

const router = express.Router();

router.get("/", user);

module.exports = router;
