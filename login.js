/*
Copyright 2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

*/

//Required modules and libraries
var express = require('express');
var path = require('path');
var session = require('express-session');
var GoogleAuth = require('google-auth-library');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser')

AWS.config.update({ region: 'us-west-2' });

var CLIENT_ID = "236526742648-j6iavch8oqjb89ar32esdpreu4p7tm9n.apps.googleusercontent.com"


var app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    resave: true,
    secret: 'secret thing',
    saveUninitialized: false,
}))


var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');

app.post('/auth/google/callback', function(req, res) {
    var id_token = req.body.id_token;
    client.verifyIdToken(id_token, CLIENT_ID,
        function(e, login) {
            var payload = login.getPayload();
            req.session.user = payload;
            console.log(payload)
        });
});

//Set the port of the app
app.set('port', process.env.PORT || 8080);

//Launch the express server
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});