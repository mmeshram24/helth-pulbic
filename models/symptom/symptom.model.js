const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SymptomSchema = new Schema({
    name: { type: String,lowercase:true, required: true },
    icon: { type: String, },
},
    { versionKey: false }
);
module.exports = mongoose.model('symptom', SymptomSchema);
