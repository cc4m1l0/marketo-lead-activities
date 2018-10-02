var request = require('request');
const config = require('config');

const getLeadIdByEmail = (apiaccesstoken, leadEmail, callback) => {
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('LEAD_ENDPOINT')
    + "?access_token=" + apiaccesstoken
    + "&filterType=email"
    + "&filterValues=" + leadEmail;
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        // console.dir(JSON.parse(body));
        var jsonresult = JSON.parse(body);
        var result = jsonresult.result;
        var leadID = result[0].id;
        callback(leadID);
    });
};

module.exports = {
    getLeadIdByEmail: function (apiaccesstoken, leadEmail, callback) {
        getLeadIdByEmail(apiaccesstoken, leadEmail, callback);
    }
};