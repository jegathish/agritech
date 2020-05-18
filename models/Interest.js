var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InterestSchema = new Schema({
    senderId: String,
    receiverId: String,
    postId: String,
    date: String
});

module.exports = mongoose.model('Interest', InterestSchema);