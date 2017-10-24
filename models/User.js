const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	password: {type: String},
});

var User = mongoose.model('users', userSchema);
module.exports = User;

