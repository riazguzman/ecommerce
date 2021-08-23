const mongoose = require("mongoose");
const crypto = require("crypto"); // For password hashing.
const uuid = require("uuid/v1"); // Create unique strings.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 32,
    },
    hashed_passwords: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String, // A long unique string (uuid) which will be used later to generate hashed password.
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual field. Hashing and encrypting password.
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1;
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto // Hahsing the password using core node.js module crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
