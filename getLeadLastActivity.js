var request = require('request');
const config = require('config');

const getNextPageToken = (apiaccesstoken, callback) =>  {
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_NEXTPAGETOKEN_ENDPOINT') +
    "?access_token=" + apiaccesstoken + "&sinceDatetime=2014-10-06T13:22:17-08:00";
    request.get(URL, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var response = JSON.parse(body);
        // console.dir(JSON.parse(body));
        callback(response.nextPageToken);
    });
}

const getActivityTypesIds = (activityTypes, start, end) => {    
    var jsonresult = activityTypes;
    var typeids = [];
    for(var i = start; i < end; i++) {
        typeid = jsonresult[i]["id"];
        typeids.push(typeid);
    }
    console.log("Type Ids" + typeids);
    return typeids;
}

const getLastActivityName = (activityTypes, lastActivity) => {
    const lastActivityTypeId = lastActivity.activityTypeId;
    var _activityTypes = activityTypes.result;
    var _lastActivity =  _activityTypes.filter(function(activity) {
        return activity.id == lastActivityTypeId;
    });
    return _lastActivity[0].name;
}

const readLeadLastActivity = (apiaccesstoken, activityTypes, leadID, callback) => {
    getNextPageToken(apiaccesstoken, function(nextPageToken) {
        const _activityTypes = activityTypes.result;
        const activityTypesNumber = _activityTypes.length;
        var activityTypeIds = [];
        var numberOfIdsPerCall = 10
        var activities = [];
        var completed_requests = 0;
        var number_of_requests = Math.floor(activityTypesNumber/numberOfIdsPerCall) + 1;
        for(var i = 0; i < number_of_requests; i++) {
            var start, end;
            start = i * numberOfIdsPerCall;
            if((start + numberOfIdsPerCall) > activityTypesNumber) {
                var diff = (start + numberOfIdsPerCall) - activityTypesNumber;
                end = (start + numberOfIdsPerCall) - diff;
            } else {
                end = start + numberOfIdsPerCall;
            }
            activityTypeIds = getActivityTypesIds(_activityTypes, start, end);
            const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_ENDPOINT') +
            "?access_token=" + apiaccesstoken +
            "&nextPageToken=" + nextPageToken +
            "&leadIds=" + leadID + 
            "&activityTypeIds=" + activityTypeIds;
            request.get(URL, (error, response, body) => {
                if(error) {
                    return console.dir(error);
                }
                var jsonresult = JSON.parse(body);
                var result = jsonresult.result;
                if(result) {
                    result.forEach(element => {
                        activities.push(element);
                    });
                }
                completed_requests++;
                if (completed_requests == number_of_requests) {
                    // All download done, process responses array
                    console.dir("list of activities: " + activities);
                    const sorted_by_date_activities = activities.sort( (a,b) => a.activityDate < b.activityDate );
                    const lastActivity = sorted_by_date_activities[0];
                    console.dir("sorted by date activities: " + sorted_by_date_activities);
                    const lastActivityName = getLastActivityName(activityTypes, lastActivity);
                    // console.dir("Last activity type name: " + lastActivityName);
                    callback(lastActivityName)
                }
            });
        }
        
    });
};

module.exports = {
    readLeadLastActivity: function (apiaccesstoken, activityTypes, leadID, callback) {
        readLeadLastActivity(apiaccesstoken, activityTypes, leadID, callback);
    }
};