const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema({
    jobId: { type: mongoose.Types.ObjectId, required: true, ref: 'JobPosting' },
    applicantProfileId: { type: mongoose.Types.ObjectId, required: true, ref: 'Applicant' },
    references: [{
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    }],
    resume: { type: String, required: true }
});

module.exports = mongoose.model('Job Application', jobApplicationSchema);