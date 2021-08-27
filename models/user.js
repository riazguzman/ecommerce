// mongoose
// For interacting with database. We connect and query to mongodb through mongoose.
const mongoose = require("mongoose");

// crypto
// Used for hashing password using crypto.createHmac().update().digest().
const crypto = require("crypto");

// uuid
// Generating salt for hashing.
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
    salt: String, // A long unique string (uuid) which will be used later to generate hashed password.i
    // We save the salt to the user itself so that we can use it to re-encrypt user passwords,
    // to test it against hashed_password.
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

// virtual field.
// Mongoose Schemas can have virtual fields.
// Virtual fields aren't saved to the database, they are generated using .set and accessed using the .get method.
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

// methods.
// We can also attatch methods to mongoose Schemas.
// They are called using Schemas.method().
userSchema.methods = {
  // This method encrypts the password defined in the params using the salt saved to user data.
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

  // This method re-encrypts the plaintext using the same salt and strategy, and compares it against
  // the hashed password saved to user data to either authenticate or deny the login attempt.
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

module.exports = mongoose.model("User", userSchema);
