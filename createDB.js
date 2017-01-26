exports.createDB = function(name) {
    var AWS = require("aws-sdk");

    AWS.config.update({
        region: "us-west-2",
        endpoint: "https://dynamodb.us-west-2.amazonaws.com/"
    });

    var dynamodb = new AWS.DynamoDB();
    console.log("Creating DynamoDB table...");

    var params = {
        TableName: name,
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" }, //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "N" },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            return;
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            return;
        }
    });
}