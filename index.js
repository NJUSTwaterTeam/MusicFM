var express = require('express');
var routes = require('./routes');
// var user = require('./routes/user');
var path = require('path');
var blogEngine = require('./blog');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var hbs = require('hbs');
var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser());
app.use(multer());

app.get('/', function (req, res){
    res.render('index',{title:"最近文章",entries:blogEngine.getBlogEntries()});
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/article/:id', function(req, res) {
   var entry = blogEngine.getBlogEntry(req.params.id);
   res.render('article',{title:entry.title, blog:entry});
});

//加载路由中模块
app.get('/api', routes.index);
// app.get('/api', function(request, response) {
//    response.send({name:"张三",age:40});
// });

app.use(express.static(path.join(__dirname, 'public')));
// app.use(routes);


// app.get('/', routes);
// app.get('/users', user.list);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// app.use(express.static(__dirname + '/music'));
// app.get('/', function(req,res){
// 	res.send('dsa!师大');
// });

// var routes = require('./routes')(app);


// app.all("*", function(request, response, next) {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   next();
// });

// app.get("/", function(request, response) {
//   response.end("Welcome to the homepage!");
// });

// app.get("/about", function(request, response) {
//   response.end("Welcome to the about page!");
// });

// app.get("/hello/:who?", function(req, res) {
//   res.send(req.params.id + " ");
//   if(req.params.id) {
//         res.end("Hello, " + req.params.who + ".");
//    }
//    else {
//         res.send("Hello, Guest.");
//    }
// });

