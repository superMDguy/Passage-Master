var server = require('../server.js')
var User = server.User;

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({
    name: 'session',
    keys: ['secret thing'],
}));

app.get('/passages', (req, res) => {
    User.findById(req.session.userID).exec()
        .then((user) => {
            res.send(user.passages);
        })
        .catch((err) => console.error(err))
});

app.post('/passages', function (req, res) {
    let passage = req.body;
	passage.created = new Date(); //Use server time for creation date

    User.findById(req.session.userID).exec()
        .then((user) => {
            user.passages.push(passage);
            user.save()
                .then(() => res.sendStatus(200))
                .catch((err) => console.error(err));
        });
});

app.put('/passages/:_id', (req, res) => {
    let _id = Number(req.params._id);

    User.findById(req.session.userID).exec()
        .then((user) => {
            let passageToModify = user.passages.id(_id);
			passageToModify.reviewFrequency = req.body.reviewFrequency;
			user.save()
				.then(() => res.sendStatus(200))
				.catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
});

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

module.exports = app;
