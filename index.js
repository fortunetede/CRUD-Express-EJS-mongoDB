const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs')

// DB Connection
mongoose.connect("mongodb+srv://taskcode:taskcode@gid-task-nqxtz.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise


const checkAuth = require('./middleware/check-auth')

const usersController = require('./controllers/users');
const booksController = require('./controllers/books')


app.use('/register', usersController.registerController)
app.use('/login', usersController.loginController)
app.use('/books', checkAuth, booksController.allBooksController)
app.use('/add_book', checkAuth, booksController.addBookController)
app.use('/book_detail/:bookId', checkAuth, booksController.bookDetailController)
app.use('/edit_book/:bookId', checkAuth, booksController.editBookController)
app.use('/delete_book/:bookId', checkAuth, booksController.deleteBookController)
app.use('/search_book/', booksController.searchBookController)
app.use('/', usersController.allBooksController)

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: 'Server error'
        }
    })
})

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Page starts on http://localhost:${port}`))