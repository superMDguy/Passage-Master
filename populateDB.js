var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com/"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing passages into DynamoDB. Please wait.");

var allPassages = JSON.parse(fs.readFileSync('passages.json', 'utf8'));
allPassages.forEach(function(passage) {
    var params = {
        TableName: "Passages",
        Item: {
            "id":  passage.id,
            "title": passage.title,
            "text":  passage.text
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add passage", passage.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", passage.title);
       }
    });
});