var request = require('request');
const auth = require('./auth');
const getActivityType = require('../getActivitityType');
const getLeadID = require('../getLeadID');
const getLeadLastActivity = require('../getLeadLastActivity');
const requestCampaign = require('../requestCampaign');

module.exports = (req, res) => {
    campaignID = req.query.campaignID;
    leadEmail = req.query.leadEmail;
    tokens = [req.query.tokens.split(',')];
    auth.getAuthToken(function(apiAccessToken) {
        getActivityType.readActivityTypes(apiAccessToken, function(activityTypes) {
            getLeadID.getLeadIdByEmail(apiAccessToken, leadEmail, function(leadID) {
                getLeadLastActivity.readLeadLastActivity(apiAccessToken, activityTypes, leadID, function(leadLastActivityName) {
                    if(campaignID && leadID){
                        requestCampaign(apiAccessToken, campaignID, [leadID], tokens, leadLastActivityName, res);
                    }
                });
            });
        });
    });
};