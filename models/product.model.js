const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
    },

    location: {
      type: String,
    },
    image: {
      type: String, // image URL
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "product must be belong to parent sub category"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
      required: [true, "sub category must be belong to parent category"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
