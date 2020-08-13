const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutus = new Schema({
    paragraph: { type: String }
},
    { versionKey: false }
);
module.exports = mongoose.model('privacy_policy', aboutus);
