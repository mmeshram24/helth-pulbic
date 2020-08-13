const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutus = new Schema({
    image: { type: String },
    paragraph: { type: String }
},
    { versionKey: false }
);
module.exports = mongoose.model('aboutus', aboutus);
