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
    auth.getAuthToken(function(apiaccesstoken) {
        getActivityType.readActivityTypes(apiaccesstoken, function(activitytypes) {
            getLeadID.getLeadIdByEmail(apiaccesstoken, leadEmail, function(leadID) {
                getLeadLastActivity.readLeadLastActivity(apiaccesstoken, activitytypes, leadID, function(leadLastActivityName) {
                    if(campaignID && leadID){
                        requestCampaign(apiaccesstoken, campaignID, [leadID], tokens, leadLastActivityName);
                        res.end('Campaign Requested / Token Updated\n');
                    }
                });
            });
        });
    });
};