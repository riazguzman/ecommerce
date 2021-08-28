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
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
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

router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
// route - make sure its post
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

// Export router using Node.js modules.
module.exports = router;
