const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
    doctor: { type: Schema.Types.ObjectId, ref: "user", required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
},
    { versionKey: false }
);
module.exports = mongoose.model('favourite_doctor', favouriteSchema);
