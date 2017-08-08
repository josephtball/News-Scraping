$(document).ready(function() {

$(document).on('click', '#scrape', function() {
	$.get('/api/scrape', function(articles) {
		var articlesDiv = $('#articles-div');
		for (var i = 0; i < articles.length; i++) {
			var article = $('<div>').addClass('article');
			var title = $('<a>')
				.addClass('title')
				.attr('href', articles[i].link)
				.attr('target', '_blank')
				.text(articles[i].title);
			article.append(title);
			var saveButton = $('<button>').addClass('save').text('Save Article');
			article.append(saveButton);
			articlesDiv.append(article);
		}
	});
});

$(document).on('click', '.save', function() {
	var article = {
		tilte: $(this).siblings().text(),
		link: $(this).siblings().attr('href'),
	};
	$.post('/api/save', article, function(data) {
		console.log(data);
	});
});

});