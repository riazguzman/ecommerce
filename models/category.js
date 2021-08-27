// mongoose
// For interacting with database. We connect and query to mongodb through mongoose.
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Category", categorySchema);
