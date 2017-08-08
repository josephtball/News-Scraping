// node packages
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');

// setup router
var router = express.Router();

router.get('/scrape', function(req, res) {
	request('https://www.reddit.com/r/news/', function (err, response, html) {
		var $ = cheerio.load(html);
		var results = [];
		$('a.title').each(function(i, element) {
			var title = $(element).text();
			var link = $(element).attr('href');
			results.push({
				title: title,
				link: link
			});
		});
		res.json(results);
	});
});

router.post('/save', function(req, res) {
	res.json(req.body);
});

router.get('/saved-articles', function(req, res) {
	var hbsObj = {};
	res.render('index', hbsObj);
});


module.exports = router;