// express
const express = require("express");

// Abstract away thse controllers (controllers are the middleware that do operations on the request and response).
const {
  create,
  read,
  update,
  remove,
  list,
  findCategoryById,
} = require("../controllers/categoryController");
const { findUserById } = require("../controllers/userController");

// Middlewares from auth controller
const {
  isAuth,
  isAdmin,
  requireSignin,
} = require("../controllers/authController");

// Create an instance of a router with all of it's function such as .get, .post etc.
const router = express.Router();

// Calls callback function every time "userId" is in the parameter.
router.param("userId", findUserById);
router.param("categoryId", findCategoryById);

// Define an endpoint.

router.get("/category/:categoryId", read);
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.delete(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get("/categories", list);

// Export router using Node.js modules.
module.exports = router;
