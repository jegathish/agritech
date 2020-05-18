var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    user: String,
    postType: String,
    product: String,
    quantity: Number,
    scale: String,
    place: String,
    name: String,
    mobile: Number,
    email: String,
    address: String,
    date: String
});

module.exports = mongoose.model('Post', PostSchema);