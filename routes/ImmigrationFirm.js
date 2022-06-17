const express = require('express');
const { check } = require('express-validator');

const immigrationFirmControllers = require('../controllers/ImmigrationFirm');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.get('/get-my-job-postings/:pageNumber', checkAuth, immigrationFirmControllers.getJobPostingByImmigrationFirmId);

router.post('/new-job-posting',
    [
        check('jobTitle')
            .not()
            .isEmpty(),
        check('jobDescription')
            .not()
            .isEmpty(),
        check('jobLocation')
            .not()
            .isEmpty(),
        check('industry')
            .not()
            .isEmpty()
    ]
    , checkAuth, immigrationFirmControllers.addJobPosting);

router.patch('/edit-job-posting',
    [
        check('jobTitle')
            .not()
            .isEmpty(),
        check('jobDescription')
            .not()
            .isEmpty(),
        check('jobLocation')
            .not()
            .isEmpty(),
        check('industry')
            .not()
            .isEmpty()
    ]
    , checkAuth, immigrationFirmControllers.editJobPosting);

router.delete('/delete-job-posting', checkAuth, immigrationFirmControllers.deleteJobPosting);

module.exports = router;