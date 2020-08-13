module.exports = (privilege) => {
    return (req, res, next) => {
        if (req.user.role && req.user.role.privileges[privilege]) {
            next();
        } else {
            res.status(403).json({ status: 403, data: null, error: true, message: "Forbidden" });
        }
    }
}