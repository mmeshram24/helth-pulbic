const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationKeysSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", index: true },
    notification_key: { type: String, index: true },
    notification_key_name : { type: String, index: true },
    created_date: { type: Date, default: Date.now },
},
    { versionKey: false }
);
module.exports = mongoose.model('notification_key', notificationKeysSchema);
