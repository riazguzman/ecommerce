// express
const express = require("express");

// Abstract away thse controllers (controllers are the middleware that do operations on the request and response).
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");
const { findUserById, read, update } = require("../controllers/userController");

// Create an instance of a router with all of it's function such as .get, .post etc.
const router = express.Router();

// Calls callback function every time "userId" is in the parameter.
// E.g. if /secret/6128965fd267fe25743bfec2 is called,
// Because: /secret/:userId this route is getting called,
// the callback function findUserById is being called.
router.param("userId", findUserById);

// Define an endpoint.
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.auth,
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

// Export router using Node.js modules.
module.exports = router;
