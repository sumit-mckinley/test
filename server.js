var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = process.env.PORT || 8080;
var session = require('express-session');

var allowCrossDomain = function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
}

var database = require('./config/database');
console.log('connection succes')
mongoose.connect(database.url);


require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
   'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
   type: 'application/vnd.api+json'
}));
app.use(methodOverride());
app.use(allowCrossDomain);


app.use(session({
   secret: 'thisisatest'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport);

app.listen(port);
console.log("App listening on port " + port);