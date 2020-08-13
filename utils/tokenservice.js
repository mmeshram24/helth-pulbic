const jwt = require("jsonwebtoken");
module.exports.getToken = function (userid) {
    let token = jwt.sign({ user: userid }, process.env.JWT_SECRET);
    return token;
}