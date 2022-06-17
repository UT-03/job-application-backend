const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicantSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    isGoogleSignedIn: { type: Boolean, required: true },
    searchKeyWords: [{ type: String, required: true }],
    phoneNumber: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    noOfChildren: { type: Number, required: false },
    countryOfResidence: { type: String, required: false },
    provinceOfCanadaWhereInterestedToWork: { type: String, required: false },
    statusInCountryOfResidence: { type: String, required: false },
    areaOfInterest: { type: String, required: false },
    workExperience: { type: String, required: false },
    highestLevelOfEducation: { type: String, required: false },
    nameOfReference1: { type: String, required: false },
    emailOfReference1: { type: String, required: false },
    phoneNumberOfReference1: { type: String, required: false },
    nameOfReference2: { type: String, required: false },
    emailOfReference2: { type: String, required: false },
    phoneNumberOfReference2: { type: String, required: false },
    nameOfReference3: { type: String, required: false },
    emailOfReference3: { type: String, required: false },
    phoneNumberOfReference3: { type: String, required: false }
});

module.exports = mongoose.model('Applicant', applicantSchema);
