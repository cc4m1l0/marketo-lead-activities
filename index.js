'use strict';
const campaignCall = require('./controllers/campaignCall');
const updateLeadLastActivityCall = require('./controllers/updateLeadLastActivityCall');

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express(); // creates express http server

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening in port 1337'));

app.get('/', campaignCall);
app.get('/updateLeadLastActivity', updateLeadLastActivityCall);
