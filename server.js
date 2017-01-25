var express = require('express');
var AWS = require("aws-sdk");

var app = express();

app.use(express.static('client'));
app.use(express.static('app/www'));

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

// app.post('/passages', function(req, res) {
//     console.log(req);
// });

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