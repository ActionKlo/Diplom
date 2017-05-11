var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('express-logger');
var mongoose = require('./libs/mongoose');
var session = require('express-session');

var app = express();

app.engine('ejs', require('ejs-locals'));

app.set('views', path.join(__dirname, '/templates'));

app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

app.use(logger({
	path: "log/logfile.txt"
}));

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.use(cookieParser("+crypto.randomBytes(64)+"));

app.use(require('./middleware/sendHttpError'));

var MongoStore = require('connect-mongo')(session);
app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	}),
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/bower_components')));

require('./routes')(app);

http.createServer(app).listen(config.get('port'), () => {
	log.info('Express server listen on port ' + config.get('port'));
});