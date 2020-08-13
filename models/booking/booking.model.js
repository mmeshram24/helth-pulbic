const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = Schema({
    question: { type: String, required: true },
    answers: [{ type: String, required: true }]
}, {
    versionKey: false,
    _id: false
})
const Symptoms = Schema({
    symptom: { type: String, require: true },
    questions: [Question]
}, {
    versionKey: false,
    _id: false
})
const BookingSchema = new Schema({
    patient: {
        name: { type: String, required: true },
        age: { type: Number },
        gender: { type: String },
        relationWithAccountHolder: { type: String },
        history: {
            medicalProblems: [{ type: String }],
            surgeries: [{ type: String }],
            currentMedication: [{ type: String }],
            smoking: { type: Boolean }
        },
    },
    doctor: { type: Schema.Types.ObjectId, index: true, ref: "user" },
    callDuration: { type: Number },
    callType: { type: String, enum: ["video", "audio"] },
    language: { type: Schema.Types.ObjectId, ref: "language" },
    symptoms: [Symptoms],
    createdBy: { type: Schema.Types.ObjectId, index: true, ref: "user" },
    createdAt: { type: Date, default: Date.now }
},
    { versionKey: false }
);
module.exports = mongoose.model('booking', BookingSchema);
