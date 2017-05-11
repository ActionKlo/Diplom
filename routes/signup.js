var User = require('../models/user').User;
var async = require('async');
var mongoose = require('../libs/mongoose');

exports.get = (req, res) => {
    res.render('signup', {});
};

exports.post = (req, res, next) => {
    var username = req.body.username;
    var company = req.body.company;
    var phone = req.body.phone;
    var email = req.body.email;
    var url = req.body.url;
    var password = req.body.password;
    var password1 = req.body.password1;

    if (password === password1) {
        async.parallel([
            (callback) => {
                var user = new User({
                    'name': username,
                    'company': company,
                    phone: phone,
                    'email': email,
                    'urlSite': url,
                    'password': password
                });
                user.save((err) => {
                    console.log(user);
                    callback(err, user);
                });
            }
        ], (err, results) => {
            res.end();
        });
    } else {
        res.writeHead(201, {
            'Location': '/signup'
        });
        res.end();
    }
}