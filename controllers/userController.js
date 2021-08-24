const User = require("../models/user");
const jwt = require("jsonwebtoken"); // To generate signed token
const expressJwt = require("express-jwt"); // For authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

const signup = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    res.json({
      user,
    });
  });
};

const signin = (req, res) => {
  // Find the user based on email.
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User with that email does not exist",
      });
    }
    // If user is found make sure the email and password match
    // Create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match",
      });
    }

    // https://jwt.io/introduction
    // Generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // Return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

const signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

// Middleware for checking if user is authenticated for accessing private routes.
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

module.exports = { signup, signin, signout };
