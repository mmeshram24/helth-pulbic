const axios = require("axios");
const querystring = require('querystring');
module.exports.getGoogleUrl = function getConnectionUrl() {
    let url = querystring.stringify({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space seperated string
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${url}`;
}
module.exports.getAccessTokenFromCode = async function getAccessTokenFromCode(code) {
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT,
            grant_type: 'authorization_code',
            code,
        },
    });
    console.log(data); // { access_token, expires_in, token_type, refresh_token }
    return data.access_token;
}

module.exports.getUserDetails = function (access_token) {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    })
};