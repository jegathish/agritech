var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    mobile: Number,
    date: String
})

module.exports = mongoose.model('User', UserSchema);