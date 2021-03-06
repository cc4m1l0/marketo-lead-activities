var request = require('request');
const config = require('config');

module.exports = (apiAccessToken, leadEmail, leadLastActivityName, leadLastActivityDescription, res) => {
    console.log('lead Email / activity Name / activity description', leadEmail, leadLastActivityName, leadLastActivityDescription);
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('LEAD_ENDPOINT')
    + "/?access_token=" + apiAccessToken;
    var data = '{ "action":"createOrUpdate", "input":[{"email":"' + leadEmail + '","lastActivityLogName":"'+ leadLastActivityName +'","lastActivityLogDescription":"'+ leadLastActivityDescription +'"}]}"';
    var json_obj = data;
    console.log(json_obj);
    request.post({
        headers: {'content-type': 'application/json'},
        url: URL,
        body: json_obj
    }, function(error, response, body){
        console.log(body)
        res.end('Activity Updated\n');
    });
};