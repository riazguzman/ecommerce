const User = require("../models/user");

exports.findUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    } else {
      req.profile = user;
      next();
    }
  });
};

exports.read = (req, res) => {
  let profile = req.profile;

  if (profile) {
    profile.hashed_password = undefined;
    profile.salt = undefined;

    return res.json({
      profile,
    });
  }
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true }
  ).exec((err, profile) => {
    if (err || !profile) {
      return res.status(400).json({
        error: "You have no access to update this profile",
      });
    }
    profile.hashed_password = undefined;
    profile.salt = undefined;
    res.json(profile);
  });
};
