const mongoose = require('mongoose');

const BooksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    author: {type: String, required: true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    genre: {type: String, required: true},
    date: {type: String, required: true},
});


module.exports = mongoose.model('Books', BooksSchema);