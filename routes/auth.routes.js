const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
} = require("../utils/validator/authValidator");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

module.exports = router;
