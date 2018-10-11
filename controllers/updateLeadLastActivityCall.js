var request = require('request');
const auth = require('./auth');
const getActivityType = require('../getActivitityType');
const getLeadID = require('../getLeadID');
const getLeadLastActivity = require('../getLeadLastActivity');
const requestLeadLastActivityUpdate = require('../requestLeadLastActivityUpdate');

module.exports = (req, res) => {
    leadEmail = req.query.leadEmail;
    auth.getAuthToken(function(apiAccessToken) {
        getActivityType.readActivityTypesCustom(apiAccessToken, function(activityTypes, customActivitiesIds) {
            getLeadID.getLeadIdByEmail(apiAccessToken, leadEmail, function(leadID) {
                getLeadLastActivity.readLeadLastActivityCustom(apiAccessToken, activityTypes, customActivitiesIds, leadID, function(leadLastActivityName, leadLastActivityDescription) {
                    if(leadLastActivityName){
                        requestLeadLastActivityUpdate(apiAccessToken, leadEmail, leadLastActivityName, leadLastActivityDescription, res);
                    } else {
                        res.end('No recent activities\n');
                    }
                });
            });
        });
    });
};