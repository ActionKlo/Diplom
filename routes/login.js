var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');

exports.get = (req, res) => {
    res.render('login', {});
};

exports.post = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    async.waterfall([
            (callback) => {
                User.findOne({
                    'name': username
                }, function (err, res) {
                    if (err) {
                        res.end(err);
                    }
                    callback(null, res);
                }), callback;
            },
            (user, callback) => {
                if (user != null) {
                    if (user.checkPassword(password)) {
                        if (user.active) {
                            if (!user.blocked) {
                                callback(null, user);
                            } else {
                                res.writeHead(203, {
                                    'Location': '/login'
                                });
                                res.end();
                            }
                        } else {
                            res.writeHead(202, {
                                'Location': '/login'
                            });
                            res.end();
                        }
                    } else {
                        res.writeHead(201, {
                            'Location': '/login'
                        });
                        res.end();
                    }
                } else {
                    res.writeHead(201, {
                        'Location': '/login'
                    });
                    res.end();
                }
            }
        ], (err, user) => {
            req.session.user = user._id;
            var status = [user.status, user._id];
            res.send({
                'status': status
            });
            res.end();
        });
};