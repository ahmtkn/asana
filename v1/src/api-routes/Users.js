const express = require("express");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const shcema = require("../validations/Users")
const {index,create,login} = require("../controllers/Users");

const router = express.Router();

router.route("/").get(authenticate, index)
router.post("/login", login)
router.route("/").post(authenticate, validate(shcema.createValidation), create)

module.exports = router