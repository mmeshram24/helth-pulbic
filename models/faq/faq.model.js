const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FAQ = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
},
    { versionKey: false }
);
module.exports = mongoose.model('faq', FAQ);
