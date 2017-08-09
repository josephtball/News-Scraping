$(document).ready(function() {
var articlesDiv = $('#articles-div');
var modalNotes = $('#modal-notes');

$(document).on('click', '#scrape', function() {
	$(this).addClass('is-loading');
	articlesDiv.empty();
	$.get('/api/scrape', function(articles) {
		for (var i = 0; i < articles.length; i++) {
			var article = $('<div>').addClass('box level');
			var title = $('<a>')
				.addClass('article-title level-left')
				.attr('href', articles[i].link)
				.attr('target', '_blank')
				.text(articles[i].title);
			article.append(title);
			var saveButton = $('<button>').addClass('save button is-info level-right').text('Save Article');
			article.append(saveButton);
			articlesDiv.append(article);
		}
		$('#scrape').removeClass('is-loading');
	});
});

$(document).on('click', '.save', function() {
	$(this).prop('disabled', true).text('Article Saved');
	var article = {
		title: $(this).siblings().text(),
		link: $(this).siblings().attr('href'),
	};
	$.post('/api/save', article, function(data) {
	});
});

$(document).on('click', '#saved-articles', function() {
	articlesDiv.empty();
	$.get('/api/saved-articles', function(articles) {
		for (var i = 0; i < articles.length; i++) {
			var article = $('<div>').addClass('box level').attr('id', articles[i]._id);
			var title = $('<a>')
				.addClass('article-title level-left')
				.attr('href', articles[i].link)
				.attr('target', '_blank')
				.text(articles[i].title);
			article.append(title);
			var buttonDiv = $('<div>').addClass('level-right')
			var viewNotesButton = $('<button>').addClass('view-notes button is-info margin-right').text('View Notes').attr('id', articles[i]._id);
			var deleteButton = $('<button>').addClass('delete-article button is-danger').text('Delete Article').attr('id', articles[i]._id);
			buttonDiv.append(viewNotesButton);
			buttonDiv.append(deleteButton);
			article.append(buttonDiv);
			articlesDiv.append(article);
		}
	});
});

$(document).on('click', '.delete-article', function() {
	var id = $(this).attr('id');
	$.ajax({
		url: '/api/article/'+id,
		type: 'DELETE'
	}).then(function(result) {
		if (result) {
			$('#'+id).remove();
		} else {
			alert('Oops. Something went wrong.');
		}
	});
});

$(document).on('click', '.view-notes', function() {
	modalNotes.empty();
	var id = $(this).attr('id');
	$.get('/api/article/'+id, function(doc) {
		$(".save-note").attr('id', doc._id);
		if (doc.notes.length > 0) {
			for (var i = 0; i < doc.notes.length; i++) {
				var note = $('<p>').text(doc.notes[i].body);
				var author = $('<span>').text(" - "+doc.notes[i].author);
				note.append(author);
				modalNotes.prepend(note);
			}
		} else {
			var noNotes = $('<p>').text('This artcile has no notes.').attr('id', 'no-note');
			modalNotes.append(noNotes);
		}
		$(".modal").addClass('is-active');
	});
});

$(document).on('click', '#close', function() {
	$(".modal").removeClass('is-active');
});

$(document).on('click', '.save-note', function(event) {
	event.preventDefault();
	var id = $(this).attr('id');
	var newNote = {
		author: $('#author').val().trim(),
		body: $('#body').val().trim(),
	};
	$.post('/api/article/'+id, newNote, function(data) {
		$('#no-note').remove();
		var note = $('<p>').text(newNote.body);
		var author = $('<span>').text(" - "+newNote.author);
		note.append(author);
		modalNotes.prepend(note);
		$('#author').val('');
		$('#body').val('');
	});
});

});