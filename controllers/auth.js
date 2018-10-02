var request = require('request');
const config = require('config');
const getToken = (callback) => {
    const URL = config.get('MARKETO_INSTANCE') + "/identity/oauth/token?grant_type=client_credentials&client_id=" 
    + config.get('MARKETO_CLIENT_ID') + "&client_secret=" + config.get('MARKETO_CLIENT_SECRET');
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var response = JSON.parse(body);
        // console.dir(response.access_token);
        callback(response.access_token);
    });
};

module.exports = {
    getAuthToken: function (callback) {
        getToken(callback);
    }
};