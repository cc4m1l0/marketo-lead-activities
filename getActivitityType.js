var request = require('request');
const config = require('config');
const readActivityTypes = (callback) => {
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_TYPES_ENDPOINT') +
    "?access_token=" + config.get('MARKETO_API_ACCESS_TOKEN');
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        // console.dir(JSON.parse(body));
        callback(JSON.parse(body));
    });
};

module.exports = {
    readActivityTypes: function (callback) {
        readActivityTypes(callback);
    }
};