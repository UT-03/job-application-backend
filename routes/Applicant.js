const express = require('express');
const { check } = require('express-validator');

const applicantControllers = require('../controllers/Applicant');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.get('/profile-data', checkAuth, applicantControllers.getProfileData);

router.post('/update-profile-data', checkAuth, applicantControllers.updateProfileData);

router.patch('/update-resume-url', checkAuth, applicantControllers.updateResumeUrl);

router.delete('/delete-resume', checkAuth, applicantControllers.deleteResume);

router.post('/apply-for-job/:jobId', checkAuth, applicantControllers.applyForJob);

module.exports = router;