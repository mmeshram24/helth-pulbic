const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    symptom: { type: Schema.Types.ObjectId, index: true, ref: "symptom" },
    title: { type: String, required: true },
    answers: [{ type: String, required: true }]
},
    { versionKey: false }
);
module.exports = mongoose.model('question', QuestionSchema);
