const axios = require("axios");
class Notification {
    constructor(userid, title, body, notificationKeyModel) {
        this.user = userid;
        this.title = title;
        this.body = body;
        this.NotificationKeyModel = notificationKeyModel;
    }
    async send() {
        return this.getNotificationKey().then(key => {
            if (key) {
                return axios.post("https://fcm.googleapis.com/fcm/send",
                    {
                        "to": key,
                        "data": {
                            title: this.title,
                            body: this.body
                        }
                    }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `key = ${process.env.FIREBASE_SERVER_KEY}`
                    }
                }).then(response => {
                    return response.data;
                }).catch(err => {
                    // console.log("E : ",err);
                    // let e = new Error(err.response.data);
                    throw err;
                })
            }else{
                throw new Error(`No Key exist for user ${this.user}`);
            }
        }).catch(err=>{
            throw err;
        })
    }
    async getNotificationKey() {
        return this.NotificationKeyModel.findOne({ user: this.user }).lean().exec().then(_key => {
            console.log("KEY  : ",_key);
            return _key ? _key.notification_key : null;
        }).catch(err => {
            throw err;
        })
    }
}
module.exports = Notification;