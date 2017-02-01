let express = require('express');
let bodyParser = require('body-parser');
let AWS = require("aws-sdk");
let path = require('path');
let session = require('express-session');
let rp = require('request-promise-native');

let createDB = require('./createDB');

AWS.config.setPromisesDependency(null);

let app = express();

app.use(express.static('client'));
app.use(express.static('app/www'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    resave: true,
    secret: 'secret thing',
    saveUninitialized: false,
}))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "client/index.html");
});

app.get('/app/', function (req, res) {
    res.sendFile(__dirname + "/" + "app/www/index.html");
});

app.get('/auth0/callback', (req, res) => {
    let code = req.query.code;

    var options = {
        url: 'https://supermdguy.auth0.com/oauth/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        form: {
            'client_id': 'oGWG8kjBrjKf6biSPhEwMXdrWRvWEyqt',
            'redirect_uri': 'http://localhost:8081/auth0/callback',
            'client_sercret': '58SRa_vZ5u7PxzimrPM2o31nF5c7ROgxzAcAJUqSRHiHADXs9TaXoqU-oVmLSpZY',
            'code': code,
            'grant_type': 'authorization_code'
        },
        json: true
    }


    rp(options)
        .then((body) => {
            console.log("Processing authorization code...");
            rp(`https://supermdguy.auth0.com/userinfo/?access_token=${body.access_token}`).then((userInfo) => {
                user = JSON.parse(userInfo);
                req.session.userID = user.user_id.toString();

                let params = {
                    TableName: req.session.userID
                };

                setInterval(() => {
                    dynamodb.describeTable(params, function (err, data) {
                        if (err) {
                            createDB.createDB(req.session.userID);
                        }
                        else if (data.Table.TableStatus == "ACTIVE") {
                            return;
                        }
                    });
                }, 1000); //Check periodically until table is active
                res.redirect('/app');
            });
        })
        .catch((err) => console.error(err));
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log(`App listening at http://${host}:${port}`)

})

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com/"
});

let docClient = new AWS.DynamoDB.DocumentClient();
let dynamodb = new AWS.DynamoDB();

app.get('/passages', (req, res) => {
    let params = {
        TableName: req.session.userID
    };
    console.log("Getting passages...");
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to scan items. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            res.send(JSON.stringify(data.Items, null, 2));
        }
    });
});

app.post('/passages', function (req, res) {
    let passage = req.body;

    let params = {
        TableName: req.session.userID,
        Item: passage
    };

    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add passage", passage.title, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", passage.title);
            res.sendStatus(200);
        }
    });
});

app.get('/passages/:id', (req, res) => {
    let id = Number(req.params.id);

    let params = {
        TableName: req.session.userID,
        Key: {
            "id": id
        }
    }

    console.log("Getting passage " + id);

    docClient.get(params, function (err, data) {
        if (err) {
            console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            res.send(JSON.stringify(data.Item, null, 2));
        }
    });
});

app.delete('/passages/:id', (req, res) => {
    let id = Number(req.params.id);

    let params = {
        TableName: 'Passages',
        Key: {
            'id': id,
        }
    }

    console.log("Deleting passage " + id)
    docClient.delete(params, function (err, data) {
        if (err) {
            console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            res.sendStatus(200);
        }
    });
})

app.patch('/setCurrentPassage/:id', (req, res) => {
    let id = Number(req.params.id);
    let passages;

    let allParams = {
        TableName: req.session.userID
    };

    console.log("Getting passages...");

    docClient.scan(allParams, function (err, data) {
        if (err) {
            console.error("Unable to scan items. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            var databasePromises = [];
            data.Items.map(function (passage) {
                let isCurrentPassage = 1 ? passage.id == id : 0;
                let params = {
                    TableName: req.session.userID,
                    Key: {
                        'id': passage.id
                    },
                    UpdateExpression: "set currentPassage = :i",
                    ExpressionAttributeValues: {
                        ":i": isCurrentPassage
                    },
                }

                databasePromises.push(docClient.update(params).promise());
            });
            Promise.all(databasePromises)
                .then(responses => {
                    res.sendStatus(200);
                })
                .catch(err => {
                    console.error('Problem in DB calls');
                    res.sendStatus(500);
                });
        }
    });

})