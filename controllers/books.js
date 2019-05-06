const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const moment = require('moment');

const Books = require('../models/books')


exports.allBooksController = (req, res, next) => {
    const _user = req.cookies['userProfile']
    const getBooks = async () => { return await Books.find().populate('creator') }
    try {
        getBooks().then(books => {
            context = {  user: _user,  books: books }
            res.render('books', context)
        })
    } catch (err) {
        console.log(err)
    }
    
}

exports.addBookController = (req, res, next) => {
    const _user = req.cookies['userProfile']
    if (req.method == 'POST') {
        const title = req.body.title
        const genre = req.body.genre
        const author = req.body.author
        const newBook = new Books({
            _id: new mongoose.Types.ObjectId,
            title: title,
            genre: genre,
            author: author,
            creator: _user.profile._id,
            date: moment().format('YYYY-MM-DD '),
        });
        newBook.save()
            .then(result => {
                if (result) {
                    return res.redirect('/books');
                } else {
                    return res.render('add_book', )
                }
            })
            .catch(err => {
                return res.render('add_book', )
            })
    } else {
        context = {
            user: _user
        }
        res.render('add_book', context)
    }
}

exports.bookDetailController = (req, res, next) => {
    const _user = req.cookies['userProfile']
    Books.findOne({_id: req.params.bookId })
        .then(book => {
            context = {
                user: _user,
                book: book
            }
            console.log(context)
            return res.render('book_detail', context)
        })
}

exports.editBookController = (req, res, next) => {
    const _user = req.cookies['userProfile']
    const _id = req.params.bookId
    if (req.method == 'POST') {
        const title = req.body.title
        const genre = req.body.genre
        const author = req.body.author
        Books.update({
                _id: _id
            }, {
                $set: {
                    title: title,
                    genre: genre,
                    author: author
                }
            })
            .then(result => {
                return res.redirect('/books')
            })
    } else {
        Books.findOne({
                _id: _id
            })
            .then(book => {
                context = {
                    user: _user,
                    book: book
                }
                res.render('edit_book', context)
            })
    }
}


exports.deleteBookController = (req, res, next) => {
    Books.deleteOne({
            _id: req.params.bookId
        })
        .then(book => {
            return res.redirect('/books')
        })
}

exports.searchBookController = (req, res) => {
    var regex = new RegExp(req.body.search, 'i');
    var query = Books.find({
        title: regex
    })
    query.exec(function (err, books) {
        if (!err) {
            context = {
                books: books
            }
            res.render('ajax_search', context)
        }
    });
}