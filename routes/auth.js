var server = require('../server.js')
var User = server.User;
var prefix = server.prefix;

const rp = require('request-promise-native');
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
}))

app.get('/callback', (req, res) => {
    let code = req.query.code;

    let options = {
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
            return rp(`https://supermdguy.auth0.com/userinfo/?access_token=${body.access_token}`)
        })
        .then((userInfo) => {
            userInfo = JSON.parse(userInfo);
            req.session.userID = userInfo.user_id.toString();
            return User.findById(req.session.userID).exec()
        })
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
        .catch((err) => console.error(err))
});

module.exports = app;
