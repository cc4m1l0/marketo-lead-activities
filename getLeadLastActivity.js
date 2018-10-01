var request = require('request');
const config = require('config');

const getNextPageToken = (callback) =>  {
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_NEXTPAGETOKEN_ENDPOINT') +
    "?access_token=" + config.get('MARKETO_API_ACCESS_TOKEN') + "&sinceDatetime=2014-10-06T13:22:17-08:00";
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var response = JSON.parse(body);
        // console.dir(JSON.parse(body));
        callback(response.nextPageToken);
    });
}

const getActivityTypesIds = (activityTypes) => {    
    var jsonresult = activityTypes;
    var types = jsonresult.result;
    var typeids = [];
    for(var i = 0; i < 10; i++) {
        typeid = jsonresult["result"][i]["id"];
        typeids.push(typeid);
    }
    return typeids;
}

const getLastActivityName = (activityTypes, lastActivity) => {
    const lastActivityTypeId = lastActivity.activityTypeId;
    console.dir(lastActivityTypeId);
}


const readLeadLastActivity = (activityTypes, callback) => {
    getNextPageToken(function(nextPageToken) {   
        var activityTypeIds = getActivityTypesIds(activityTypes);
        const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_ENDPOINT') +
        "?access_token=" + config.get('MARKETO_API_ACCESS_TOKEN') +
        "&nextPageToken=" + nextPageToken +
        "&leadIds=6" + 
        "&activityTypeIds=" + activityTypeIds;
        request.get(URL, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            var jsonresult = JSON.parse(body);
            var activities = jsonresult.result;
            const sorted_by_date_activities = activities.sort( (a,b) => a.activityDate < b.activityDate );
            const lastActivity = sorted_by_date_activities[0];
            getLastActivityName(activityTypes, lastActivity);
            // console.dir(JSON.parse(body));
            callback(lastActivity);
        });
    });
};

module.exports = {
    readLeadLastActivity: function (activityTypes, callback) {
        readLeadLastActivity(activityTypes, callback);
    }
};