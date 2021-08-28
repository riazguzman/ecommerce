const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

const findCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: `Category with ID ${id} not found`,
      });
    } else {
      req.category = category;
    }
    next();
  });
};

const create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

const read = (req, res) => {
  let category = req.category;

  if (category) {
    return res.json({
      category,
    });
  }
};

const update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

const remove = (req, res) => {
  const category = req.category;

  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        message: "Category Deleted",
      });
    }
    res.json({ data });
  });
};

const list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        message: "Category Deleted",
      });
    }
    res.json({ data });
  });
};

module.exports = { read, create, update, remove, list, findCategoryById };
