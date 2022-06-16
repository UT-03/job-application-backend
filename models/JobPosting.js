const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobPostingFirmSchema = new Schema({
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobLocation: { type: String, required: true },
    industry: { type: String, required: true },
    keyWords: [{ type: String, required: false }],
    postedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'ImmigrationFirm' }
});

module.exports = mongoose.model('JobPosting', jobPostingFirmSchema);