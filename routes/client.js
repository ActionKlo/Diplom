var User = require('../models/user').User;
var async = require('async');

exports.get = (req, res) => {
    var id = req.params.id


    async.waterfall([
        first,
        second
    ], (err, user) => {
        res.render('client', {
            id: id
        });
    });

    function first(callback) {
        User.find({
            '_id': id
        }, (err, user) => {
            if (err) {
                return res.redirect('/404');
            } else {
                callback(null, user);
            }
        });
    };

    function second(user, callback) {
        console.log(user);

        if (!user) {
            return res.redirect('/404');
        }

        callback(null, user);
    }
};