const express = require('express');
const { check } = require('express-validator');

const applicantControllers = require('../controllers/Applicant');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();



module.exports = router;