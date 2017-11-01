const mongoose = require('mongoose');

let imageSchema = new mongoose.Schema({
	imagename: {type: String},
	imagetitle: {type: String},
	username: {type: String},
	imagetype: {type: String},
	sessionname: {type: String},
	imageindex: {type: Number, default:0}
});

var Image = mongoose.model('images', imageSchema);
module.exports = Image;

