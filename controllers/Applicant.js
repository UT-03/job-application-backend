const Applicant = require("../models/Applicant");
const HttpError = require("../util/HttpError");

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

    for (const key in data) {
        if (key.toString() !== 'email' && key.toString() !== 'password' && key.toString() !== 'isGoogleSignedIn' && key.toString() !== 'resume') {
            existingApplicant[key] = data[key];
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
}

module.exports = {
    getProfileData,
    updateProfileData,
    updateResumeUrl,
    deleteResume
}