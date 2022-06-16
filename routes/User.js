const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/User');

const router = express.Router();

router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .not()
            .isEmpty(),
        check('password')
            .isLength({ min: 6 })
    ]
    , usersControllers.signup);

router.post('/login', usersControllers.login);

router.post('/google-signin', usersControllers.googleSignin);

module.exports = router;