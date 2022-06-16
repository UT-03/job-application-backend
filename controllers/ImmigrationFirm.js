const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const HttpError = require('../util/HttpError');
const Applicant = require('../models/Applicant');
const JobPosting = require('../models/JobPosting');
const ImmigrationFirm = require('../models/ImmigrationFirm');

const getJobPostingByImmigrationFirmId = async (req, res, next) => {
    // Getting userId from req data
    const userId = req.userData.userId;

    let existingImmigrationFirm;
    try {
        existingImmigrationFirm = await ImmigrationFirm.findById(userId).populate('jobsPosted');
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingImmigrationFirm) {
        const error = new HttpError('This account is not registered in our database, Please signup first', 404);
        return next(error);
    }

    res.json({
        jobsPosted: existingImmigrationFirm.jobsPosted
    })
}

const addJobPosting = async (req, res, next) => {
    // If Inputs are invalid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 406);
        return next(error);
    }

    // Getting userId from req data
    const userId = req.userData.userId;

    const { jobTitle, jobDescription, jobLocation, industry, keyWords } = req.body;

    const newJobPosting = new JobPosting({
        jobTitle,
        jobDescription,
        jobLocation,
        industry,
        keyWords,
        postedBy: req.userData.userId
    });

    // Searching existing user with the given userId.
    let existingUser;
    try {
        existingUser = await ImmigrationFirm.findById(userId);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    // If user does not exist (highly unlikely, but keeping it as a safer measure)
    if (!existingUser) {
        const error = new HttpError('This account is not registered in our database, Please signup first', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newJobPosting.save({ session: sess });
        existingUser.jobsPosted.push(newJobPosting);
        await existingUser.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.status(201).json(newJobPosting);
}

const editJobPosting = async (req, res, next) => {
    // If Inputs are invalid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 406);
        return next(error);
    }

    // Getting userId from req data
    const userId = req.userData.userId;

    const { _id, jobTitle, jobDescription, jobLocation, industry, keyWords } = req.body;

    let existingJobPosting;
    try {
        existingJobPosting = await JobPosting.findById(_id);
    }
    catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingJobPosting) {
        const error = new HttpError(null, 404);
        return next(error);
    }

    if (existingJobPosting.postedBy.toString() !== userId.toString()) {
        const error = new HttpError('You are not allowed to edit this Job Posting', 401);
        return next(error);
    }

    existingJobPosting.jobTitle = jobTitle;
    existingJobPosting.jobDescription = jobDescription;
    existingJobPosting.jobLocation = jobLocation;
    existingJobPosting.industry = industry;
    existingJobPosting.keyWords = keyWords;

    try {
        await existingJobPosting.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.json(existingJobPosting);
}

const deleteJobPosting = async (req, res, next) => {
    // Getting userId from req data
    const userId = req.userData.userId;

    const { _id } = req.body;

    let jobPostingToBeDeleted;
    try {
        jobPostingToBeDeleted = await JobPosting.findById(_id).populate('postedBy');
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!jobPostingToBeDeleted) {
        const error = new HttpError(null, 404);
        return next(error);
    }

    if (jobPostingToBeDeleted.postedBy._id.toString() !== req.userData.userId.toString()) {
        const error = new HttpError('You are not allowed to delete this Job Posting.', 401);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await jobPostingToBeDeleted.remove({ session: sess });

        jobPostingToBeDeleted.postedBy.jobsPosted.pull(jobPostingToBeDeleted);
        await jobPostingToBeDeleted.postedBy.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.json({ message: "Job Posting deleted!" });
}

module.exports = {
    getJobPostingByImmigrationFirmId,
    addJobPosting,
    editJobPosting,
    deleteJobPosting
}