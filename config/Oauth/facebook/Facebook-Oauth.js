const queryString = require("querystring");
const axios = require("axios");
const stringifiedParams = queryString.stringify({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_REDIRECT,
    // scope: ['email', 'user_friends'].join(','), // comma seperated string
    scope: ['email'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
});

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

module.exports.getFacebookUrl = function () {
    return facebookLoginUrl;
}
module.exports.getAccessTokenFromCode = async function (code) {
    const { data } = await axios({
        url: 'https://graph.facebook.com/v4.0/oauth/access_token',
        method: 'get',
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT,
            code,
        },
    });
    console.log(data); // { access_token, token_type, expires_in }
    return data.access_token;
};

module.exports.getUserDetails = async function (access_token) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: access_token,
      },
    });
    // console.log(data); // { id, email, first_name, last_name }
    return data;
  };