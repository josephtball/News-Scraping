var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	author: {
		type: String,
		minlength: [1, 'Please enter your name.'],
		required: 'Please enter your name.'
	},
	body: {
		type: String,
		minlength: [1, 'Note cannot be empty.'],
		required: 'Note cannot be empty.'
	}
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;