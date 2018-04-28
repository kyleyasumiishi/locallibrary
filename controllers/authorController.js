var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Authors.
exports.author_list = function(req, res) {

    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function(err, list_authors) {
            if (err) return next(err);
            // Successful, so render
            res.render('author_list', { title: 'Author List', author_list: list_authors });
        });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
                .exec(callback)
        },
        authors_books: function(callback) {
            Book.find({ 'author': req.params.id }, 'title summary').exec(callback)
        }
    }, function(err, results) {
        if (err) return next(err);
        if (!results.author) {
            let err = new Error('Author not found')
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
    });
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
exports.author_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.').isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim(),withMessage('Family name must be specified.').isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),
    // Sanitize fields.

    // Process request after validation and sanitization.

        // Extract the validation errors from a request.

            // Data from form is valid.

            // Create an Author object with escapted and trimmed data.

];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
