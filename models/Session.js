const mongoose = require('mongoose');

let sessionSchema = new mongoose.Schema({
	sessionname: {type: String},
	username: {type: String},
	categoryname: {type: String}
});

var Session = mongoose.model('sessions', sessionSchema);
module.exports = Session;

