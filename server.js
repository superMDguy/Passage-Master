const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieSession = require('cookie-session')
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
const Schema = mongoose.Schema
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');

var passageSchema = new Schema({
    _id: Number,
    title: String,
    text: String,
    reviewFrequency: String,
    //Review Frequency is either odd/even, day of a week, or date of a month
    created: Date,
}, { usePushEach: true });

var userSchema = new Schema({
    name: String,
    _id: String,
    passages: [passageSchema]
}, { usePushEach: true });

var User = mongoose.model('User', userSchema)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Opened database connection!!")
});

exports.User = User;

const prefix = "http://localhost:8081"
exports.prefix = prefix;

let app = express();
app.use('/api', require('./routes/api.js'))
app.use('/auth0', require('./routes/auth.js'))

app.use(express.static('client'));
app.use(express.static('app/www'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({
    name: 'session',
    keys: ['secret thing'],
}))

app.get('/', function (req, res) {
    res.sendFile("client/index.html", { root: __dirname });
});

app.get('/app/', function (req, res) {
    res.sendFile("app/www/index.html", { root: __dirname });
});

app.listen(process.env.PORT || 8081, () => {
    console.log('App started successfully!')
});

