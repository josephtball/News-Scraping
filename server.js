// node packages
var express = require('express');
var bodyParser = require('body-parser');
// var methodOverride = require("method-override");
var exphbs = require('express-handlebars');

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
/*// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));*/
// handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// set static folder
app.use(express.static(__dirname + "/public"));

app.use('/', htmlRoutes);
app.use('/api/', apiRoutes);

// setup server to listen
app.listen(port, function() {
	console.log('Server listening on PORT '+port);
});