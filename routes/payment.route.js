const express = require('express');
const router = express.Router();
const authorizePrivilege = require("../middleware/authorizationMiddleware");
var ccav = require('../utils/ccavutil');

router.post('/payment', authorizePrivilege("GET_ALL_BRANDS"), (request, response) => {
  var body = '';
  var workingKey = process.env.CCAVENUE_WORKING_KEY;	//Put in the 32-Bit key shared by CCAvenues.
  var accessCode = process.env.CCAVENUE_ACCESS_CODE;			//Put in the Access Code shared by CCAvenues.
  var encRequest = '';
  var formbody = '';
  request.body.merchant_id = process.env.CCAVENUE_MERCHANT_ID;
  encRequest = ccav.encrypt(request.body, workingKey);
  console.log(encRequest);
  formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';

  // request.on('data', function (data) {
  //   console.log(data);
  //   return
  // });

  // request.on('end', function () {
  //   response.writeHeader(200, { "Content-Type": "text/html" });
  //   response.write(formbody);
  //   response.end();
  // });
  return;
})

module.exports = router;