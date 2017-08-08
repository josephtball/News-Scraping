// node packages
var express = require('express');

// setup router
var router = express.Router();

router.get('/', function(req, res) {
	var hbsObj = {
		title: 'Scraper News'
	}
	res.render('index', hbsObj);
});

module.exports = router;