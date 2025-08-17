const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

const subCategoryRoute = require("./subCategory.routes");

const authController = require("../controllers/auth.controller");

router.use("/:categoryId/subCategory", subCategoryRoute);
router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("Manager", "Admin", "Agent"),
    controller.uploadCategoryImage,
    controller.resizeImage,
    controller.createProducts
  )
  .get(controller.getProducts);

router
  .route("/:id")
  .get(controller.getProduct)
  .put(
    authController.protect,
    authController.allowedTo("Manager", "Admin", "Agent"),
    controller.uploadCategoryImage,
    controller.resizeImage,
    controller.updateProducts
  )
  .delete(
    authController.protect,
    authController.allowedTo("Admin", "Agent"),
    controller.deleteProducts
  );
module.exports = router;
