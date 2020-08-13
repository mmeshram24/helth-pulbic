const router = require("express").Router();
const notificaionRoute = require("./notification/notification.route");
router.use("/notification",notificaionRoute);
module.exports = router;