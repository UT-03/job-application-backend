const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const immigrationFirmSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    pssword: { type: String, required: false },
    isGoogleSignedIn: { type: Boolean, required: true },
    jobsPosted: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Job' }]
});

module.exports = mongoose.model('ImmigrationFirm', immigrationFirmSchema);