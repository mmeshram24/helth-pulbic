const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: { type: String, required: true },
},
    { versionKey: false }
);
module.exports = mongoose.model('language', languageSchema);
