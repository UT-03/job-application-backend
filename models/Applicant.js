const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicantSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    noOfChildren: { type: Number, required: true },
    countryOfResidence: { type: String, required: true },
    provinceOfCanadaWhereInterestedToWork: { type: String, required: true },
    statusInCountryOfResidence: { type: String, required: true },
    areaOfInterest: { type: String, required: true },
    workExperience: { type: String, required: true },
    highestLevelOfEducation: { type: String, required: true },
    nameOfReference1: { type: String, required: true },
    emailOfReference1: { type: String, required: true },
    phoneNumberOfReference1: { type: String, required: true },
    nameOfReference2: { type: String, required: true },
    emailOfReference2: { type: String, required: true },
    phoneNumberOfReference2: { type: String, required: true },
    nameOfReference3: { type: String, required: true },
    emailOfReference3: { type: String, required: true },
    phoneNumberOfReference3: { type: String, required: true }
});

module.exports = mongoose.model('Applicant', applicantSchema);
