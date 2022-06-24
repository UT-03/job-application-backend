const Applicant = require("../models/Applicant");
const JobApplication = require("../models/JobApplication");
const JobPosting = require("../models/JobPosting");
const HttpError = require("../util/HttpError");
const { checkIsProfileComplete } = require("../util/utilityFuncs");
const mongoose = require('mongoose');

const getProfileData = async (req, res, next) => {
    const userId = req.userData.userId;

    let existingApplicant;
    try {
        existingApplicant = await Applicant.findById(userId).select('-password -isGoogleSignedIn');
    }
    catch (err) {
        const error = new HttpError();
        return next(error);
    }

    if (!existingApplicant) {
        const error = new HttpError("This user is not registered in our database, Please signup first.", 404);
        return next(error);
    }

    console.log(existingApplicant);

    res.json({
        applicantProfileData: existingApplicant
    })
}

const updateProfileData = async (req, res, next) => {
    const { ...data } = req.body;

    console.log(data);

    const userId = req.userData.userId;

    let existingApplicant;
    try {
        existingApplicant = await Applicant.findById(userId);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingApplicant) {
        const error = new HttpError('This user is not registered in our database, Please try signup first.', 404);
        return next(error);
    }

    const byPassFields = ['email', 'password', 'isGoogleSignedIn', 'resume', 'references']
    for (const key in data) {
        if (!byPassFields.includes(key)) {
            existingApplicant[key] = data[key];
        }

        if (key === 'references') {
            let references$ = [];
            data[key].forEach(ref => {
                if (ref !== '' && ref.email !== '' && ref.phoneNumber !== '')
                    references$.push(ref);
            });

            existingApplicant.references = references$;
        }
    }

    try {
        await existingApplicant.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.json({
        message: "Profile updated!"
    });
}

const updateResumeUrl = async (req, res, next) => {
    const userId = req.userData.userId;

    const { resumeURL } = req.body;

    let existingApplicant;
    try {
        existingApplicant = await Applicant.findById(userId).select('resume');
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingApplicant) {
        const error = new HttpError('This user is not registered in our database. Please try signup.', 404);
        return next(error);
    }

    existingApplicant.resume.push(resumeURL);

    try {
        await existingApplicant.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.json({
        message: "Resume added"
    });
};

const deleteResume = async (req, res, next) => {
    const userId = req.userData.userId;

    const { urlToBeDeleted } = req.body;

    let existingApplicant;
    try {
        existingApplicant = await Applicant.findById(userId).select('resume');
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingApplicant) {
        const error = new HttpError('This user is not registered in our database. Please try signup.', 404);
        return next(error);
    }

    let newResumeArray = existingApplicant.resume.filter(rs => rs !== urlToBeDeleted);

    existingApplicant.resume = newResumeArray;

    try {
        await existingApplicant.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.json({
        message: "url deleted"
    })
};

const isProfileComplete = async (req, res, next) => {
    const userId = req.userData.userId;

    let existingApplicant;
    try {
        existingApplicant = await Applicant.findById(userId);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingApplicant) {
        const error = new HttpError('This user is not registered in our database. Please try signup.', 404);
        return next(error);
    }

    let isProfileComplete = checkIsProfileComplete(existingApplicant);

    res.json({
        isProfileComplete: isProfileComplete
    })
};

const applyForJob = async (req, res, next) => {
    const userId = req.userData.userId;

    const { jobId } = req.params;

    const { requestObj, selectedReferencesIndex, selectedResume } = req.body;

    let existingApplicant;
    try {
        existingApplicant = await Applicant.findById(userId);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingApplicant) {
        const error = new HttpError('This user is not registered in our database, Please try signup first.', 404);
        return next(error);
    }

    const byPassFields = ['email', 'password', 'isGoogleSignedIn', 'resume', 'references']
    for (const key in requestObj) {
        if (!byPassFields.includes(key)) {
            existingApplicant[key] = requestObj[key];
        }

        if (key === 'references') {
            let references$ = [];
            requestObj[key].forEach(ref => {
                if (ref !== '' && ref.email !== '' && ref.phoneNumber !== '')
                    references$.push(ref);
            });

            existingApplicant.references = references$;
        }
    }

    try {
        await existingApplicant.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    console.log(requestObj, selectedReferencesIndex, selectedResume);

    const references = selectedReferencesIndex.map(index => requestObj.references[index]);

    const newJobApplication = new JobApplication({
        jobId: jobId,
        applicantProfile: existingApplicant,
        references: references,
        resume: selectedResume
    })

    let existingJobPosting;
    try {
        existingJobPosting = await JobPosting.findById(jobId);
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    if (!existingJobPosting) {
        const error = new HttpError();
        return next(error);
    }

    existingJobPosting.jobApplications.push(newJobApplication);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newJobApplication.save({ session: sess });
        await existingJobPosting.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = new HttpError();
        return next(error);
    }

    res.json({ message: "Applied for the job" });
}

module.exports = {
    getProfileData,
    updateProfileData,
    updateResumeUrl,
    deleteResume,
    isProfileComplete,
    applyForJob
}