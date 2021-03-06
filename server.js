// node packages
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');

// import files
var htmlRoutes = require('./routes/htmlRoutes.js');
var apiRoutes = require('./routes/apiRoutes.js');

// set port
var port = process.env.PORT || 8080;

// setup express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// set static folder
app.use(express.static(__dirname + "/public"));

app.use('/', htmlRoutes);
app.use('/api', apiRoutes);

// setup connection to database
mongoose.Promise = Promise;
mongoose.connect('mongodb://heroku_nmsdrpwp:pi8pcfhjsqc5pk3qvbe2j6rlds@ds135382.mlab.com:35382/heroku_nmsdrpwp');
// mongoose.connect('mongodb://localhost/ScraperNewsdb');
var db = mongoose.connection;
db.on('error', function(error) {
	console.log('Mongoose error: ', error);
});
db.once('open', function() {
	console.log('Mongoose connection successful.');
});

// setup server to listen
app.listen(port, function() {
	console.log('Server listening on PORT '+port);
});