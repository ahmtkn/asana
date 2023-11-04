const express = require("express");
const { create, index, update, destroy} = require("../controllers/Projects");
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const schema = require('../validations/Projects');
const router = express.Router();

router.get("/", index);
router.route('/').post(authenticate, validate(schema.createValidation), create);
router.route('/:id').patch(authenticate, validate(schema.updateValidation), update);
router.route('/:id').delete(authenticate, destroy)
module.exports = router