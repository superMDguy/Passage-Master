var express = require('express');
var app = express();

app.use(express.static('client'));

app.get('/app', function (req, res) {
   res.sendFile( __dirname + "/" + "client/index.html" );
})

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port)

})