var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var db = require('./models/db');
var route = require('./routes/index');
var config = require('./config');

var app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
	type: 'application/vnd.api + json'
}));

app.use(cookieParser());
// config.session.store = new MongoStore(config.mongo);
app.use(session(config.session));
// app.use(express.session({
//     secret: 'a4f8071f-c873-4447-8ee2',
//     cookie: { maxAge: 2628000000 },
//     store: new (require('express-sessions'))({
//         storage: 'mongodb',
//         instance: mongoose, // optional 
//         host: 'localhost', // optional 
//         port: 27017, // optional 
//         db: 'blog', // optional 
//         collection: 'sessions', // optional 
//         expire: 86400 // optional 
//     })
// }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

route(app);
app.get("*", function(req, res) {
	res.sendFile(__dirname + 　'/public/index.html');
});

app.listen(process.env.PORT || config.app, function() {
	console.log('blog listening on port ' + (process.env.PORT || config.app));
});