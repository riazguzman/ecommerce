// express
const express = require("express");

// controllers
const { sayHi } = require("../controllers/userController");

const router = express.Router();

router.get("/", sayHi);

module.exports = router;