const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    hashed_password: {
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
  {
    timestamps: true,
  }
);

// virtual field. Hashing and encrypting password.
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4(); // We initilize the salt
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) {
      return "";
    } else {
      try {
        return crypto // Hahsing the password using core node.js module crypto
          .createHmac("sha1", this.salt)
          .update(password)
          .digest("hex");
      } catch (err) {
        return "";
      }
    }
  },

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

module.exports = mongoose.model("User", userSchema);
