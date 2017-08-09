// node packages
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');

// models
var Article = require('../models/article.js');
var Note = require('../models/note.js');

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
	var newArticle = new Article({
		title: req.body.title,
		link: req.body.link
	});
	newArticle.save(function(err, article) {
		if (err) {
			console.log('Error: ', err);
			res.send(err);
		}
	});
});

router.get('/saved-articles', function(req, res) {
	Article.find({}, function(err, articles) {
		if (err) {
			console.log('Error: ', err);
			res.send(err);
		} else {
			res.json(articles);
		}
	});
});

router.delete('/article/:id', function(req, res) {
	Article.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log('Error: ', err);
			res.send(false);
		} else {
			res.send(true);
		}
	});
	
});

router.get('/article/:id', function(req, res) {
	Article.findOne({ _id: req.params.id })
		.populate('notes')
		.exec(function(err, doc) {
			if (err) {
				console.log('Error: ', err);
				res.send(err);
			} else {
				res.json(doc);
			}
		});
});

router.post('/article/:id', function(req, res) {
	var newNote = new Note({
		author: req.body.author,
		body: req.body.body
	});
	newNote.save(function(err, doc) {
		if (err) {
			console.log('Error: ', err);
			res.send(err);
		} else {
			Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: doc._id }})
			.exec(function(err, doc) {
				if (err) {
					console.log('Error: ', err);
					res.send(err);
				} else {
					res.json(doc);
				}
			});
		}
	});
});

module.exports = router;