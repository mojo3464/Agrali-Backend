const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");
const subCategoryRoute = require("./subCategory.routes");

const authController = require("../controllers/auth.controller");

router.use("/:categoryId/subCategory", subCategoryRoute);
router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("Manager", "Admin"),
    controller.uploadCategoryImage,
    controller.resizeImage,
    createCategoryValidator,
    controller.createCategory
  )
  .get(controller.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, controller.getCategory)
  .put(
    authController.protect,
    authController.allowedTo("Manager", "Admin"),
    controller.uploadCategoryImage,
    controller.resizeImage,
    updateCategoryValidator,
    controller.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("Admin"),
    deleteCategoryValidator,
    controller.deleteCategory
  );
module.exports = router;
