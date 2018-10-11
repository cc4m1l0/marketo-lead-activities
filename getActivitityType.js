var request = require('request');
const config = require('config');
const readActivityTypes = (apiAccessToken, callback) => {
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_TYPES_ENDPOINT') +
    "?access_token=" + apiAccessToken;
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        // console.dir(JSON.parse(body));
        callback(JSON.parse(body));
    });
};

const readActivityTypesCustom = (apiAccessToken, callback) => {
    const listActivitiesID = [1,2,3,6,7,8,9,10,11,39,40,41,42,45,111,112,400,401,402,403,405,406,407,408,409,410];
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_TYPES_ENDPOINT') +
    "?access_token=" + apiAccessToken;
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        // console.dir(JSON.parse(body));
        callback(JSON.parse(body), listActivitiesID);
    });
};

module.exports = {
    readActivityTypes: function (apiAccessToken, callback) {
        readActivityTypes(apiAccessToken, callback);
    },
    readActivityTypesCustom: function (apiAccessToken, callback) {
        readActivityTypesCustom(apiAccessToken, callback);
    }
};