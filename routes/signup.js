var User = require('../models/user').User;
var async = require('async');
var mongoose = require('../libs/mongoose');

exports.get = function (req, res) {
    res.render('signup', {});
};

exports.post = function (req, res, next) {
    var username = req.body.username;
    var company = req.body.company;
    var phone = req.body.phone;
    var email = req.body.email;
    var url = req.body.url;
    var password = req.body.password;
    var password1 = req.body.password1;

    if (password === password1) {
        async.parallel([
            function (callback) {
                var user = new User({
                    'name': username,
                    'company': company,
                    phone: phone,
                    'email': email,
                    'urlSite': url,
                    'password': password
                });
                user.save(function (err) {
                    console.log(user);
                    callback(err, user);
                });
            }
        ], function (err, results) {
            res.end();
        });
    } else {
        res.writeHead(201, {
            'Location': '/signup'
        });
        res.end();
    }
}