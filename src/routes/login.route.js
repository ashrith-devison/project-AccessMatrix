const express = require('express');
const { validate } = require('../controllers/verification.login.controller');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

router.post('/login', asyncHandler(validate));

module.exports = router;