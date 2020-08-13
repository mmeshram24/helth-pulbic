const jwt = require("jsonwebtoken");
const User = require("../models/user/user.model").User;
const response = require("../utils/response");
module.exports = (forRegister) => {
    return function (req, res, next) {
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        return response(res, 401, null, true, "Invalid token");
                    } else {
                        User.findById(payload.user).lean().exec().then(d => {
                            if (d) {
                                delete d.password;
                                if (forRegister && d.active)
                                    return response(res, 200, { user: d }, false, "You are already logged in");
                                if (forRegister || (!d.active))
                                    return response(res, 401, null, false, "Your account has been disabled");
                                req.user = d;
                                next();
                            } else {
                                response(res, 401, null, true, "Your token is not valid anymore");
                            }
                        }).catch(e => response(res, 500, null, true, "Error while retriving user details"));
                    }
                })
            }
        } else {
            if (forRegister)
                return next();
            response(res, 401, null, true, "Unauthorized");
        }
    }
}