const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const moment = require('moment');

const Users = require('../models/users')
const Books = require('../models/books')

exports.allBooksController = (req, res, next) => {
    const getBooks = async () => {
        return await Books.find().populate('creator')
    }
    getBooks().then(books => {
        context = {  books: books }
        res.render('home', context)
    })
}

exports.registerController = (req, res, next) => {
    if (req.method == 'POST') {
        const userUsername = req.body.username
        const userEmail = req.body.email
        const userPassword = req.body.password

        const registerAsyncFunc = async () => {
            return await Users.find({email: userEmail})
        }
        registerAsyncFunc().then(email => {
                if (email.length >= 1) {
                    return res.render('register', {
                        message: 'Sorry, This Email already exist'
                    })
                } else {
                    console.log('entrying password')
                    bcrypt.hash(userPassword, 10, (err, hash) => {
                        if (err) {
                            console.log('password incomplete', err)
                        } else {
                            console.log('good password')
                            const user = new Users({
                                _id: new mongoose.Types.ObjectId,
                                email: userEmail,
                                password: hash,
                                username: userUsername,
                                date: moment().format('YYYY-MM-DD '),
                            });
                            const token = jwt.sign({
                                    email: user.email,
                                    userId: user._id
                                },
                                process.env.JWT_KEY, {
                                    expiresIn: "9h"
                                }
                            )
                            user.save()
                                .then(result => {
                                    if (result._id) {
                                        return res.redirect('/login');
                                    } else {
                                        return res.render('register', {
                                            message: 'registration failed'
                                        })
                                    }
                                })
                                .catch(err => {
                                    return res.render('register', {
                                        message: 'registration failed'
                                    })
                                })
                        }
                    })
                }
            })
    } else {
        res.render('register', {
            message: 'Register Here'
        })
    }
}


exports.loginController = (req, res, next) => {

    if (req.method == 'POST') {
        const userEmail = req.body.email
        const userPassword = req.body.password

        const loginAsyncFunc = async () => {
            return await Users.find({email: userEmail})
        }
        loginAsyncFunc().then(user => {
                if (user.length < 1) {
                    return res.render('login', {
                        message: 'Incorrect Email'
                    })
                } else {
                    bcrypt.compare(userPassword, user[0].password, (err, result) => {
                        if (err) {
                            return res.render('register', {
                                message: 'Incorrect Password'
                            })
                        }
                        if (result) {
                            const token = jwt.sign({
                                    email: user[0].email,
                                    userId: user[0]._id
                                },
                                process.env.JWT_KEY, {
                                    expiresIn: "1h"
                                })
                            res.cookie('userProfile', {
                                profile: user[0],
                                token: token
                            })
                            console.log('good password')
                            return res.redirect('/books')
                        }
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: err
                })
            })
    } else {
        return res.render('login', {
            message: 'Login Here'
        })
    }
}