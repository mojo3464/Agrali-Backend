const CategoryModel = require("../models/category.model");
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
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  next();
});

// @desc get list of all category
// @route GET /api/v1/category
// @access Public

exports.getCategories = factory.getAll(CategoryModel);

// @desc Get specific category by id
// @route GET /api/v1/category/:id
// @access Public

exports.getCategory = factory.getOne(CategoryModel);

// @desc Create Category
// @route POST /api/v1/category
// @access Private/Admin-Manager

exports.createCategory = factory.createOne(CategoryModel);

// @desc Update specific category
// @route PUT /api/v1/category/:id
// @access Private/Admin-Manager

exports.updateCategory = factory.updateOne(CategoryModel);

// @desc Delete specific category
// @route DELETE /api/v1/category/:id
// @access Private/Admin

exports.deleteCategory = factory.deleteOne(CategoryModel);

// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//     const id = req.params.id;
//     const category = await CategoryModel.findOneAndDelete({ _id: id });

//     if (!category) {
//         // res.status(404).json({ msg: `No category for this id ${id}` });
//         return next(new ApiError(`No category for this id ${id}`, 404));
//     }

//     res.status(204).json({ msg: `Category Deleted` });
// })
