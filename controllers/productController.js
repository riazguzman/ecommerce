const formidable = require("formidable");
const _ = require("lodash");
const Product = require("../models/product");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

const findProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        res.status(400).json({
          error: `Product with ID ${id} not found`,
        });
      } else {
        req.product = product;
      }

      next();
    });
};

const read = (req, res) => {
  let product = req.product;

  if (product) {
    product.photo = undefined;

    return res.json({
      product,
    });
  }
};

const remove = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      deletedProduct,
      message: "Product deleted successfully",
    });
  });
};

const create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded" + err,
      });
    } else {
      let product = new Product(fields);
      let { name, description, price, category, quantity, shipping } = fields;
      let photo = files.photo;

      // validations
      if (photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "Image should be less than 1mb in size",
          });
        }

        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }

      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        !shipping
      ) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      product.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          res.json(data);
        }
      });
    }
  });
};

module.exports = { create, findProductById, read, remove };
