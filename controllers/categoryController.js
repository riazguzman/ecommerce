const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

const create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, dat) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

module.exports = { create };