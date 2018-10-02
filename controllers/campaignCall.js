var request = require('request');
const auth = require('./auth');
const getActivityType = require('../getActivitityType');
const getLeadLastActivity = require('../getLeadLastActivity');
const requestCampaign = require('../requestCampaign');

module.exports = (req, res) => {
    campaignID = req.query.campaignID;
    leadIDs = [req.query.leadID.split(',')];
    tokens = [req.query.tokens.split(',')];
    auth.getAuthToken(function(apiaccesstoken) {
        getActivityType.readActivityTypes(apiaccesstoken, function(activitytypes) {
            getLeadLastActivity.readLeadLastActivity(apiaccesstoken, activitytypes, function(leadLastActivityName) {
                if(campaignID && leadIDs){
                    requestCampaign(apiaccesstoken, campaignID, leadIDs, tokens, leadLastActivityName);
                }
            });
        });
    });
};