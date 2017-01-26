var express = require('express');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");

var app = express();

app.use(express.static('client'));
app.use(express.static('app/www'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "client/index.html");
});

app.get('/app/', function(req, res) {
    res.sendFile(__dirname + "/" + "app/www/index.html");
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`App listening at http://${host}:${port}`)

})

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com/"
});

var docClient = new AWS.DynamoDB.DocumentClient();

app.get('/passages', (req, res) => {
    var params = {
        TableName: "Passages"
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
    var passage = req.body;

    var params = {
        TableName: "Passages",
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
    var id = Number(req.params.id);

    var params = {
        TableName: "Passages",
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
    var id = Number(req.params.id);

    var params = {
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
    var id = Number(req.params.id);
    var passages;

    var allParams = {
        TableName: "Passages"
    };

    console.log("Getting passages...");

    docClient.scan(allParams, function(err, data) {
        if (err) {
            console.error("Unable to scan items. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success!");
            data.Items.forEach(passage => {
                var isCurrentPassage = 1 ? passage.id == id : 0;
                var params = {
                    TableName: 'Passages',
                    Key: {
                        'id': passage.id
                    },
                    UpdateExpression: "set currentPassage = :i",
                    ExpressionAttributeValues: {
                        ":i": isCurrentPassage
                    },
                }

                docClient.update(params, function(err, data) {
                    if (err) {
                        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                    }
                });
            });
            res.sendStatus(200);
        }
    });

})