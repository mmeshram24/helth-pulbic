const jwt = require("jsonwebtoken");
const User = require("../models/user/user.model");
const response = require("../utils/response");
module.exports = (req, res, next) => {
    if (req.headers.token) {
        if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
            jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    next();
                } else {
                    User.findById(payload.user).populate("role").lean().exec().then(d => {
                        if (d) {
                            delete d.password;
                            if ((!d.active))
                                return response(res, 401, null, false, "Your account has been disabled");
                            req.user = d;
                            next();
                        } else {
                            next();
                        }
                    }).catch(e => {
                        console.log(e);
                        response(res, 500, null, true, "Error while retriving user details")
                    });
                }
            })
        }
    } else {
        next();
    }
}