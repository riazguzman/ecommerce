// express
const express = require("express");
const router = express.Router();

// Abstract away thse controllers (controllers are the middleware that do operations on the request and response).
const {
  create,
  read,
  findProductById,
  remove,
  update,
} = require("../controllers/productController");
const { findUserById } = require("../controllers/userController");

// Middlewares from auth controller
const {
  isAuth,
  isAdmin,
  requireSignin,
} = require("../controllers/authController");

// Calls callback function every time "userId" is in the parameter.
router.param("userId", findUserById);
router.param("productId", findProductById);

// Define endpoints
router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);

// Export router using Node.js modules.
module.exports = router;
