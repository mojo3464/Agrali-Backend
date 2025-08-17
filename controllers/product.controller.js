const productModel = require("../models/product.model");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");
const factory = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

// 2- memoryStorage save picture in memory  as a buffer

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// image processing
exports.resizeImage = asyncHandler((req, res, next) => {
  // if we refactor we make multi arguments for this we don't refactoring this
  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/products/${filename}`);
  req.body.image = filename;
  next();
});

// @desc get list of all Products
// @route GET /api/v1/Products
// @access Public

exports.getProducts = factory.getAll(productModel);

// @desc Get specific Products by id
// @route GET /api/v1/Products/:id
// @access Public

exports.getProduct = factory.getOne(productModel);

// @desc Create Products
// @route POST /api/v1/Products
// @access Private/Admin-Manager

exports.createProducts = factory.createOne(productModel);

// @desc Update specific Products
// @route PUT /api/v1/Products/:id
// @access Private/Admin-Manager

exports.updateProducts = factory.updateOne(productModel);

// @desc Delete specific Products
// @route DELETE /api/v1/Products/:id
// @access Private/Admin

exports.deleteProducts = factory.deleteOne(productModel);
