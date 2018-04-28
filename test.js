var async = require('async');

async.parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 2000);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 1000);
    }
],
// optional callback
function(err, results) {
    // the results array will equal ['one', 'two'] even though the second function that a shorter timeout.
    if (err) return console.log(err);
    return console.log(results);
});


console.log(([] instanceof Array));