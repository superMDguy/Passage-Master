let express = require('express');
let bodyParser = require('body-parser');
let AWS = require("aws-sdk");
let path = require('path');
let session = require('express-session');
let GoogleAuth = require('google-auth-library');

let createDB = require('./createDB')

const CLIENT_ID = "236526742648-j6iavch8oqjb89ar32esdpreu4p7tm9n.apps.googleusercontent.com"

AWS.config.setPromisesDependency(null);

let app = express();

app.use(express.static('client'));
app.use(express.static('app/www'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    resave: true,
    secret: 'secret thing',
    saveUninitialized: false,
}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "client/index.html");
});

app.get('/app/', function(req, res) {
    res.sendFile(__dirname + "/" + "app/www/index.html");
});

let auth = new GoogleAuth;
let client = new auth.OAuth2(CLIENT_ID, '', '');

app.post('/auth/google/callback', (req, res) => {
    var id_token = req.body.id_token;
    client.verifyIdToken(id_token, CLIENT_ID,
        function(e, login) {
            var payload = login.getPayload();
            req.session.user = payload;
            console.log(payload);
            let params = {
                TableName: payload.sub.toString()
            };

            setInterval(() => {
                dynamodb.describeTable(params, function(err, data) {
                    if (err) {
                        createDB.createDB(payload.sub);
                    }
                    else if (data.Table.TableStatus == "ACTIVE") {
                        return;
                    }
                });
            }, 1000);
             res.sendStatus(200);
        });
});

app.post('/auth0/callback', (req, res) => {
    var id_token = req.body.id_token;
    client.verifyIdToken(id_token, CLIENT_ID,
        function(e, login) {
            var payload = login.getPayload();
            req.session.user = payload;
            console.log(payload);
            let params = {
                TableName: payload.sub.toString()
            };

            setInterval(() => {
                dynamodb.describeTable(params, function(err, data) {
                    if (err) {
                        createDB.createDB(payload.sub);
                    }
                    else if (data.Table.TableStatus == "ACTIVE") {
                        return;
                    }
                });
            }, 1000);
             res.sendStatus(200);
        });
});

let server = app.listen(8081, function() {
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
        TableName: req.session.user.sub
    };
    console.log("Getting passages...");
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan items. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            res.send(JSON.stringify(data.Items, null, 2));
        }
    });
});

app.post('/passages', function(req, res) {
    let passage = req.body;

    let params = {
        TableName: req.session.user.sub,
        Item: passage
    };

    docClient.put(params, function(err, data) {
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
        TableName: req.session.user.sub,
        Key: {
            "id": id
        }
    }

    console.log("Getting passage " + id);

    docClient.get(params, function(err, data) {
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
    docClient.delete(params, function(err, data) {
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
        TableName: req.session.user.sub
    };

    console.log("Getting passages...");

    docClient.scan(allParams, function(err, data) {
        if (err) {
            console.error("Unable to scan items. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            var databasePromises = [];
            data.Items.map(function(passage) {
                let isCurrentPassage = 1 ? passage.id == id : 0;
                let params = {
                    TableName: 'Passages',
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