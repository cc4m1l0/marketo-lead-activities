var request = require('request');
const config = require('config');

module.exports = (apiaccesstoken, leadEmail, leadLastActivityName) => {
    console.log('lead Email / activity Name', leadEmail, leadLastActivityName);
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('LEAD_ENDPOINT')
    + "/?access_token=" + apiaccesstoken;
    var data = '{ "action":"createOrUpdate", "input":[{"email":"' + leadEmail + '","lastActivityLogName":"'+ leadLastActivityName +'"}]}"';
    var json_obj = data;
    console.log(json_obj);
    request.post({
        headers: {'content-type': 'application/json'},
        url: URL,
        body: json_obj
    }, function(error, response, body){
        console.log(body)
    });
};