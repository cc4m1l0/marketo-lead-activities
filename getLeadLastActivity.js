var request = require('request');
const config = require('config');

const getNextPageToken = (apiaccesstoken, callback) =>  {
    var sinceDatetime = new Date(Date.now() - 604800000);
    const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_NEXTPAGETOKEN_ENDPOINT') +
    "?access_token=" + apiaccesstoken + "&sinceDatetime=" + sinceDatetime.toISOString();
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
    // console.log("Type Ids" + typeids);
    return typeids;
}

const getActivityTypesCustomIds = (activityTypesCustom, start, end) => {    
    var typeids = [];
    for(var i = start; i < end; i++) {
        typeid = activityTypesCustom[i];
        typeids.push(typeid);
    }
    // console.log("Type Ids: " + typeids);
    return typeids;
}

const checkIfActivityTypeIDEqualsTo = (activity, id) => {
    var check = false;
    const lastActivityTypeId = activity.activityTypeId;
    if (lastActivityTypeId == id) {
        check = true;
    }
    return check;
}

const getLastActivityName = (activityTypes, lastActivity) => {
    const lastActivityTypeId = lastActivity.activityTypeId;
    var _activityTypes = activityTypes.result;
    var _lastActivity =  _activityTypes.filter(function(activity) {
        return activity.id == lastActivityTypeId;
    });
    return _lastActivity[0].name;
}

const readLeadLastActivity = (apiAccessToken, activityTypes, leadID, callback) => {
    getNextPageToken(apiAccessToken, function(nextPageToken) {
        const _activityTypes = activityTypes.result;
        const activityTypesNumber = _activityTypes.length;
        var activityTypeIds = [];
        var numberOfIdsPerCall = 10
        var activities = [];
        var completed_requests = 0;
        var number_of_requests = Math.floor(activityTypesNumber/numberOfIdsPerCall);
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
            "?access_token=" + apiAccessToken +
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
                    // console.dir("list of activities: " + JSON.stringify(activities) );
                    const sorted_by_date_activities = activities.sort(function(a, b) {
                        a = new Date(a.activityDate);
                        b = new Date(b.activityDate);
                        return a>b ? -1 : a<b ? 1 : 0;
                    });
                    const lastActivity = sorted_by_date_activities[0];
                    // console.dir("sorted by date activities: " + sorted_by_date_activities);
                    console.dir("Last activity: " + JSON.stringify(lastActivity));
                    const lastActivityName = getLastActivityName(activityTypes, lastActivity);
                    const lastActivityDescription = lastActivity.primaryAttributeValue;
                    // console.dir("Last activity type name: " + lastActivityName);
                    // console.dir("Last activity type description: " + lastActivityDescription);
                    callback(lastActivityName, lastActivityDescription);
                }
            });
        }
        
    });
};

const readLeadLastActivityCustom = (apiAccessToken, activityTypes, customActivitiesIds, leadID, callback) => {
    getNextPageToken(apiAccessToken, function(nextPageToken) {
        const activityTypesNumber = customActivitiesIds.length;
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
            activityTypeIds = getActivityTypesCustomIds(customActivitiesIds, start, end);
            const URL = config.get('MARKETO_API') + config.get('MARKETO_API_VERSION') + config.get('ACTIVITY_ENDPOINT') +
            "?access_token=" + apiAccessToken +
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
                    // console.dir("list of activities: " + JSON.stringify(activities) );
                    var lastActivity, penultActivity;
                    const sorted_by_date_activities = activities.sort(function(a, b) {
                        a = new Date(a.activityDate);
                        b = new Date(b.activityDate);
                        return a>b ? -1 : a<b ? 1 : 0;
                    });
                    // console.dir("sorted by date activities: " + sorted_by_date_activities);
                    lastActivity = sorted_by_date_activities[0];
                    if(sorted_by_date_activities.length > 1) {
                        penultActivity = sorted_by_date_activities[1];
                        if(checkIfActivityTypeIDEqualsTo(penultActivity, '2')) {
                            lastActivity = penultActivity;
                        }
                    }
                    //console.dir("last Activity: " + JSON.stringify(lastActivity));
                    if (lastActivity) {
                        const lastActivityName = getLastActivityName(activityTypes, lastActivity);
                        const lastActivityDescription = lastActivity.primaryAttributeValue;
                        // console.dir("Last activity type name: " + lastActivityName);
                        // console.dir("Last activity type description: " + lastActivityDescription);
                        callback(lastActivityName, lastActivityDescription);
                    } else {
                        callback(null);
                    }
                }
            });
        }
        
    });
};

module.exports = {
    readLeadLastActivity: function (apiAccessToken, activityTypes, leadID, callback) {
        readLeadLastActivity(apiAccessToken, activityTypes, leadID, callback);
    },
    readLeadLastActivityCustom: function (apiAccessToken, activityTypes, customActivitiesIds, leadID, callback) {
        readLeadLastActivityCustom(apiAccessToken, activityTypes, customActivitiesIds, leadID, callback);
    }
};