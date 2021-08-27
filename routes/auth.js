// express
const express = require("express");

// Validator
// For express-validator. Abstracts away the middleware for checking request inputs for signup.
const userSignUpValidator = require("../validator/index");

// controllers
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.get("/hello", requireSignin, (req, res) => {
  res.send("hello there");
});

module.exports = router;
