var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: {type: String, enum: ['Fiction', 'Non-Fiction', 'Romance', 'History', 'Science Fiction', 'Children', 'Fantasy', 'French Poetry'], default: 'Non-Fiction', max: 100, min: 3, required: true}
});

// Virtual for genre's URL
GenreSchema.virtual('url').get(function() {
    return '/catalog/genre/' + this._id;
});

// Export model
module.exports = mongoose.model('Genre', GenreSchema);