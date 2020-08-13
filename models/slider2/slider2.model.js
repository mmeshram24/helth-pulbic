const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secondSlider = new Schema({
    image: { type: String, required: true }
},
    { versionKey: false }
);
module.exports = mongoose.model('slider2', secondSlider);
