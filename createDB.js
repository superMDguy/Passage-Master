exports.createDB = function (name, database) {
    const mongodb = require("mongodb");
    const ObjectID = mongodb.ObjectID;

    var db;

    mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Save database object from the callback for reuse.
        db = database;
        console.log("Database connection ready");

    });
}