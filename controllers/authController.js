const User = require("../models/user");
const jwt = require("jsonwebtoken"); // To generate signed token
const expressJwt = require("express-jwt"); // For authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

/*******************************************************************************************************************/
// Middleware that handles signup functionality.
/*******************************************************************************************************************/
const signup = (req, res) => {
  // Create knew user.
  const user = new User(req.body);

  // Attmpt to save user to databse.
  // Callback function will be called when database responds.
  user.save((err, user) => {
    // Database returns error if it doesn't like the input. E.g. The email might already be used when it is defined
    // to be unique in the schema.
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }

    // Otherwise return the user.
    res.json({
      user,
    });
  });
};

/*******************************************************************************************************************/
// Sign in user.
/*******************************************************************************************************************/
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
    // If user is authenticated, generate a token that contains the user's _id.
    const token = jwt.sign(
      { _id: user._id, nice: "nice" },
      process.env.JWT_SECRET
    );

    // Persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });

    // Return response with user and token.
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

/*******************************************************************************************************************/
// Signout.
/*******************************************************************************************************************/
const signout = (req, res) => {
  // Clear token cookie.
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

// Auth middlewares:
// These middelwares like to attatch information to the request.

// 1.
/*******************************************************************************************************************/
// Middleware for checking if user is using a valid jwt.
/*******************************************************************************************************************/
// It then decrypts the jwt token, then places it in whatever parameter we put for userProperty.
// E.g. In this case, request.auth.
const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

// 2.
/*******************************************************************************************************************/
// Middleware that checks if the decrypted token contains the id that matches the id of the request user.
/*******************************************************************************************************************/
// E.g. To check if the token that is being used to access some user's data, is actually that person's token.
const isAuth = (req, res, next) => {
  // req.profile to access the _id of the username that was used for the login attempt.
  // req.profile was saved using the findByUserId middleware in userController.
  // req.auth is the data from the decrypated authentication token saved by expressJwt() middleware.
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

// 3.
/*******************************************************************************************************************/
// Checks if the requested profile is an admin profile or not.
/*******************************************************************************************************************/
const isAdmin = (req, res, next) => {
  console.log(req.profile);
  if (req.profile.role == 0) {
    return res.status(403).json({ error: "Admin resource! Access denied" });
  }
  next();
};

module.exports = { signup, signin, signout, requireSignin, isAuth, isAdmin };
