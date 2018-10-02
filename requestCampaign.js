var request = require('request');
const config = require('config');

const buildLeadIDsObject = (leadIDs) => {    
    var _leadIDs = [];
    leadIDs.forEach(element => {
        _leadIDs.push('{"id":"' + element + '"}');
    });
    return _leadIDs;
}

const buildTokensObject = (tokens, leadLastActivityName) => {    
    var _tokens = [];
    tokens.forEach(element => {
        _tokens.push('{"name":"{{' + element + '}}"');
        _tokens.push('"value":"' + leadLastActivityName + '"}');
    });
    return _tokens;
}

module.exports = (apiaccesstoken, campaignID, leadID, tokens, leadLastActivityName) => {
    console.log('campaign ID / lead ID / tokens / activity Name', campaignID, leadID, tokens[0], leadLastActivityName);
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('CAMPAING_ENDPOINT') +
    campaignID + "/trigger.json?access_token=" + apiaccesstoken;
    _leadIDs = buildLeadIDsObject(leadID);
    _tokens = buildTokensObject(tokens, leadLastActivityName);
    var data = '{ "input":{"leads":['+ _leadIDs +'],"tokens":['+ _tokens +"]}}";
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