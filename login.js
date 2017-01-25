/*
Copyright 2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

*/

//Required modules and libraries
var express = require('express');
var passport = require('passport')
var path = require('path');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var util = require('util');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser')

AWS.config.update({ region: 'us-west-2' });

//Declaration of all properties linked to the environment (beanstalk configuration)
var AWS_ACCOUNT_ID = '165652961927';
var COGNITO_IDENTITY_POOL_ID = 'us-west-2:389a1ba3-f8e1-480c-ae0e-794cb844ec3b';
var IAM_ROLE_ARN = 'arn:aws:iam::165652961927:role/Cognito_PassageMasterAuth_Role';
var COGNITO_DATASET_NAME = 'PassageMaster';

//Declaration of variables for the app
var cognitosync;
var THE_TITLE = "Google Cognito Sample App Node.js";

//Initialize express
var app = express();

app.use(passport.initialize());
app.use(passport.session());

// setup of the app (view,assets,cookies,...)
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({ secret: 'foo', resave: true, saveUninitialized: true, cookie: { expires: false } }));

app.use(bodyParser.urlencoded({ extended: false }))

//GET Logout Page
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/auth/google/callback', function(req, res) {
    var id_token = req.body.id_token;
    var decoded = jwt.decode(id_token);

    req.token = decoded;
    res.redirect('/loggedin');
});

app.get('/loggedin', function(req, res) {
    var params = {
        IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
        Logins: {
            'accounts.google.com': req.token
        }
    };

    // initialize the Credentials object with our parameters
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

    // We can set the get method of the Credentials object to retrieve
    // the unique identifier for the end user (identityId) once the provider
    // has refreshed itself
    AWS.config.credentials.get(function(err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);

        // Other service clients will automatically use the Cognito Credentials provider
        // configured in the JavaScript SDK.
        var cognitoSyncClient = new AWS.CognitoSync();
        cognitoSyncClient.listDatasets({
            IdentityId: AWS.config.credentials.identityId,
            IdentityPoolId: COGNITO_IDENTITY_POOL_ID
        }, function(err, data) {
            if (!err) {
                console.log(JSON.stringify(data));
            }
        });
    });
})

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler, Stacktrace is displayed
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("<h1>500 Internal Server Error</h1>")
});

//Simple route middleware to ensure user is authenticated. Use this route middleware on any resource that needs to be protected.
//If the request is authenticated (via a persistent login session),
//the request will proceed.  Otherwise, the user will be redirected to the home page for login.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

//Set the port of the app
app.set('port', process.env.PORT || 8080);

//Launch the express server
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});