var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult} = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all Genre.
exports.genre_list = function(req, res, next) {

    Genre.find()
        .sort([['name', 'ascending']])
        .exec(function(err, list_genres) {
            if (err) return next(err);
            // Successful, so render
            res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
        });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
            .exec(callback);
        },

    }, function(err, results) {
        if (err) return next(err);
        if (results.genre == null) {
            let err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books })
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre '});
};

// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({
            name: req.body.name
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                    if (err) return next(err);
                    if (found_genre) {
                        // Genre exists, redirect to its detail page
                        res.redirect(found_genre.url);
                    }
                    else {
                        genre.save(function (err) {
                            if (err) return next(err);
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {

    Genre.findById(req.params.id)
    .exec(function(err, results) {
        if (err) return next(err);
        if (results == null) {
            res.redirect('/catalog/genres');
        }
        res.render('genre_delete', {title: 'Delete Genre', genre: results});
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback)
        },
        books: function(callback) {
            Book.find({}).exec(callback)
        },
    }, function(err, results) {
        if (err) return next(err);

        // Check if there are any books with this genre.
        var genre_books = [];

        for (let book_iter = 0; book_iter < results.books.length; book_iter++) {
            for (let book_g_iter = 0; book_g_iter < results.books[book_iter].genre.length; book_g_iter++) {
                if (results.genre._id.toString() == results.books[book_iter].genre[book_g_iter]._id.toString()) {
                    genre_books.push(results.books[book_iter]);
                }
            }
        }

        if (genre_books.length > 0) {
            // Genre has books. Render in the same way as for GET route.
            res.render('genre_delete', {title: 'Delete Genre', genre: results.genre, genreUsed: true, genre_books: genre_books, books: results.books});
            return;
        }
        else {
            // Genre has no books. Delete genre and redirect to list of genres.
            Genre.findByIdAndRemove(req.params.id, function deleteGenre(err) {
                if (err) return next(err);
                res.redirect('/catalog/genre');
            })
        }
    })
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};