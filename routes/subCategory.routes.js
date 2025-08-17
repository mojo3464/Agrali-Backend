const express = require("express");
// mergeParams allow us to access paremters on other routers   use categoryId params from category router in subCategory routers
const router = express.Router({ mergeParams: true });
const subCategoryController = require("../controllers/subCategory.controller");
const subCategoryValidator = require("../utils/validator/subCategoryValidator");

const authController = require("../controllers/auth.controller");

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("Manager", "Admin"),
    subCategoryController.setCategoryToBody,
    subCategoryValidator.createSubCategoryValidator,
    subCategoryController.createsubCategory
  )
  .get(
    subCategoryController.createFilterObj,
    subCategoryController.getsubCategories
  );

router
  .route("/:id")
  .get(
    subCategoryValidator.getSubCategoryValidator,
    subCategoryController.getsubCategory
  )
  .put(
    authController.protect,
    authController.allowedTo("Manager", "Admin"),
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updatesubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("Admin"),
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deletesubCategory
  );

module.exports = router;
