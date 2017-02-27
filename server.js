const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const rp = require('request-promise-native');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
const Schema = mongoose.Schema

const createDB = require('./createDB');

let app = express();
const prefix = "http://localhost:8081"
// const prefix = "http://passagemaster.com"

app.use(express.static('client'));
app.use(express.static('pm-app/www'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    resave: true,
    secret: 'secret thing',
    saveUninitialized: false,
}))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');

var passageSchema = new Schema({
    _id: Number,
    title: String,
    text: String,
    reviewFrequency: String
});

var userSchema = new Schema({
    name: String,
    _id: String,
    passages: [passageSchema]
});

var User = mongoose.model('User', userSchema)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Opened database connection!!")
});

app.get('/', function (req, res) {
    res.sendFile("client/index.html", { root: __dirname });
});

app.get('/app/', function (req, res) {
    res.sendFile("pm-app/www/index.html", { root: __dirname });
});

app.get('/auth0/callback', (req, res) => {
    let code = req.query.code;

    var options = {
        url: 'https://supermdguy.auth0.com/oauth/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        form: {
            'client_id': 'oGWG8kjBrjKf6biSPhEwMXdrWRvWEyqt',
            'redirect_uri': (prefix + '/auth0/callback'),
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
                userInfo = JSON.parse(userInfo);
                req.session.userID = userInfo.user_id.toString();
                User.findById(req.session.userID).exec()
                    .then((user) => {
                        if (!user) { //User doesn't exist, create an entry for it
                            let emptyUser = new User({ _id: req.session.userID, name: userInfo.name, passages: [] });
                            emptyUser.save()
                                .then(() => res.redirect('/app'))
                                .catch((err) => console.error(err));
                        } else {
                            res.redirect('/app')
                        }
                    })
                    .catch((err) => console.error(err));
            });
        })
        .catch((err) => console.error(err))
});

app.get('/passages', (req, res) => {
    User.findById(req.session.userID).exec()
        .then((user) => {
            res.send(user.passages);
        })
        .catch((err) => console.error(err))
});

app.post('/passages', function (req, res) {
    let passage = req.body;

    User.findById(req.session.userID).exec()
        .then((user) => {
            user.passages.push(passage);
            user.save()
                .then(() => res.sendStatus(200))
                .catch((err) => console.error(err));
        });
});

// app.get('/passages/:id', (req, res) => {
//     let id = Number(req.params.id);

//     let params = {
//         TableName: req.session.userID,
//         Key: {
//             "id": id
//         }
//     }

//     console.log("Getting passage " + id);

//     docClient.get(params, function (err, data) {
//         if (err) {
//             console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
//         } else {
//             console.log("Success!");
//             res.send(JSON.stringify(data.Item, null, 2));
//         }
//     });
// });

app.delete('/passages/:_id', (req, res) => {
    let _id = Number(req.params._id);

    User.findById(req.session.userID).exec()
        .then((user) => {
            let passageToRemove = user.passages.id(_id).remove();
            user.save()
                .then(() => res.sendStatus(200))
                .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
});

// app.patch('/setCurrentPassage/:id', (req, res) => {
//     let id = Number(req.params.id);
//     let passages;

//     let allParams = {
//         TableName: req.session.userID
//     };

//     console.log("Getting passages...");

//     docClient.scan(allParams, function (err, data) {
//         if (err) {
//             console.error("Unable to scan items. Error JSON:", JSON.stringify(err, null, 2));
//         } else {
//             console.log("Success!");
//             var databasePromises = [];
//             data.Items.map(function (passage) {
//                 let isCurrentPassage = 1 ? passage.id == id : 0;
//                 let params = {
//                     TableName: req.session.userID,
//                     Key: {
//                         'id': passage.id
//                     },
//                     UpdateExpression: "set currentPassage = :i",
//                     ExpressionAttributeValues: {
//                         ":i": isCurrentPassage
//                     },
//                 }

//                 databasePromises.push(docClient.update(params).promise());
//             });
//             Promise.all(databasePromises)
//                 .then(responses => {
//                     res.sendStatus(200);
//                 })
//                 .catch(err => {
//                     console.error('Problem in DB calls');
//                     res.sendStatus(500);
//                 });
//         }
//     });

// });

app.listen(process.env.PORT || 8081, () => {
    console.log('App started successfully!')
});
