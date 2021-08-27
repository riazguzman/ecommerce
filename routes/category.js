// express
const express = require("express");
// Create an instance of a router with all of it's function such as .get, .post etc.
const router = express.Router();

// Abstract away thse controllers (controllers are the middleware that do operations on the request and response).
const { create } = require("../controllers/categoryController");
const { findUserById } = require("../controllers/userController");

// Middlewares from auth controller
const {
  isAuth,
  isAdmin,
  requireSignin,
} = require("../controllers/authController");

// Define an endpoint.
router.post("/create:userId", requireSignin, isAuth, isAdmin, create);

// Calls callback function every time "userId" is in the parameter.
router.param("userId", findUserById);

// Export router using Node.js modules.
module.exports = router;
