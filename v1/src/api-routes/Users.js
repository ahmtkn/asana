const express = require("express");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const shcema = require("../validations/Users")
const {index, create, update,
    login, resetPassword, projectList,
    destroy, changePassword, updateProfileImage} = require("../controllers/Users");

const router = express.Router();

router.route("/").get(authenticate, index)
router.route("/projects").get(authenticate, projectList)
router.post("/login", login)
router.route("/").post(authenticate, validate(shcema.createValidation), create)
router.route("/").patch(authenticate,validate(shcema.updateValidation), update)
router.route("/reset-password").post(resetPassword)
router.route('/:id').delete(authenticate, destroy)
router.route('/change-password').post(authenticate, validate(shcema.changePassword), changePassword)
router.route('/update-profile-image').post(authenticate, updateProfileImage)

module.exports = router