var request = require('request');
const getActivityType = require('../getActivitityType');
const getLeadLastActivity = require('../getLeadLastActivity');
const requestCampaign = require('../requestCampaign');

module.exports = (req, res) => {
    campaignID = req.query.campaignID;
    leadIDs = [req.query.leadID.split(',')];
    tokens = [req.query.tokens.split(',')];
    getActivityType.readActivityTypes(function(activitytypes) {
        getLeadLastActivity.readLeadLastActivity(activitytypes, function(leadLastActivity) {
            if(campaignID && leadIDs){
                requestCampaign(campaignID, leadIDs, tokens);
            }
        });
    });
};