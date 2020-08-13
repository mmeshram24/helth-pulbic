const axios = require("axios");
module.exports = class DeviceRegistration {
    constructor(NotificationKeyModel) {
        this.NotificationKeyModel = NotificationKeyModel;
        this.API_KEY = process.env.FIREBASE_SERVER_KEY;
        this.SENDER_ID = process.env.FIREBASE_SENDER_ID;
    }
    async getUserNotificationKey(userid) {
        return this.NotificationKeyModel.findOne({ user: userid }).lean().then(n_key => {
            if (!n_key) {
                return null;
            } else {
                return n_key;
            }
        })
    }
    async addNewDeviceGroup(userid, deviceRegisterationToken) {
        return this.getUserNotificationKey(userid).then(notifKey => {
            if (notifKey) {
                console.log("ALREDY")
                let { notification_key_name, notification_key } = notifKey;
                let params = { userid, deviceRegisterationToken, notification_key_name, notification_key }
                return this.addDeviceRegisterationTokenToDeviceGroup(params).then(data=>{
                    console.log("DATA is : ",data);
                    return data;
                }).catch(err=>{
                    throw err;
                });
            } else {
                const notification_key_name = `appUser-${userid}`;
                return axios.post("https://fcm.googleapis.com/fcm/notification", {
                    "operation": "create",
                    "notification_key_name": notification_key_name,
                    "registration_ids": [deviceRegisterationToken]
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `key=${this.API_KEY}`,
                        "project_id": this.SENDER_ID,
                    }
                }).then(response => {
                    console.log("Create Device Group", response.data);
                    let notification_key = response.data.notification_key;
                    let notifKey = new this.NotificationKeyModel({ user: userid, notification_key, notification_key_name });
                    return notifKey.save().then(document => {
                        return String(document.notification_key);
                    }).catch(err => {
                        throw err;
                    })
                }).catch(err => {
                    throw err;
                })
            }
        }).catch(err=>{
            throw err;
        })
    }
    async addDeviceRegisterationTokenToDeviceGroup({ userid, deviceRegisterationToken, notification_key_name, notification_key }) {
        return axios.post("https://fcm.googleapis.com/fcm/notification",
            {
                "operation": "add",
                "notification_key_name": notification_key_name,
                "notification_key": notification_key,
                "registration_ids": [deviceRegisterationToken]
            }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `key = ${this.API_KEY}`,
                "project_id": this.SENDER_ID,
            }
        }).then(response => {
            console.log("addDeviceRegisterationTokenToDeviceGroup : ", response.data);
            return this.updateNotificationKey(userid, response.data.notification_key).then(doc => {
                console.log("DATA 2 : ",doc);
                return doc;
            }).catch(err => {
                throw err
            });
        }).catch(err => {
            throw err;
        })
    }
    async updateNotificationKey(userid, notification_key) {
        return this.NotificationKeyModel.findOneAndUpdate({ user: userid }, { $set: { notification_key } }).lean().then(doc => {
            return doc ? doc.notification_key : null;
        }).catch(err => {
            throw err;
        })
    }
    // async removeDeviceRegistrationTokenFromDeviceGroup
}