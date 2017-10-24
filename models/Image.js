const mongoose = require('mongoose');

let imageSchema = new mongoose.Schema({
	imagename: {type: String},
	username: {type: String},
	imagetype: {type: String},
	sessionname: {type: String}
});

var Image = mongoose.model('images', imageSchema);
module.exports = Image;

