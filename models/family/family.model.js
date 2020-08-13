const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
    name: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    relationWithAccountHolder: { type: String },
    history: {
        medicalProblems: [{ type: String }],
        surgeries: [{ type: String }],
        currentMedication: [{ type: String }],
        smoking: { type: Boolean }
    },
    user: { type: Schema.Types.ObjectId, ref: "user", index: true }
},
    { versionKey: false }
);
module.exports = mongoose.model('family_member', familyMemberSchema);
