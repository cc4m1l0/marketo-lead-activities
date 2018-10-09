var request = require('request');
const auth = require('./auth');
const getActivityType = require('../getActivitityType');
const getLeadID = require('../getLeadID');
const getLeadLastActivity = require('../getLeadLastActivity');
const requestLeadLastActivityUpdate = require('../requestLeadLastActivityUpdate');

module.exports = (req, res) => {
    leadEmail = req.query.leadEmail;
    auth.getAuthToken(function(apiaccesstoken) {
        getActivityType.readActivityTypes(apiaccesstoken, function(activitytypes) {
            getLeadID.getLeadIdByEmail(apiaccesstoken, leadEmail, function(leadID) {
                getLeadLastActivity.readLeadLastActivity(apiaccesstoken, activitytypes, leadID, function(leadLastActivityName, leadLastActivityDescription) {
                    if(leadEmail){
                        requestLeadLastActivityUpdate(apiaccesstoken, leadEmail, leadLastActivityName, leadLastActivityDescription, res);
                    }
                });
            });
        });
    });
};