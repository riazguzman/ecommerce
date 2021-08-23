// express
const express = require("express");

// Validator
const userSignUpValidator = require("../validator/index");

// controllers
const { signup } = require("../controllers/userController");
const { signin } = require("../controllers/userController");
const { signout } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
module.exports = router;
