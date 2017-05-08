var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');

exports.get = (req, res) => {
    async.waterfall([
        first
    ], (err, user) => {
        if (err) {
            console.error(err);
        } else {
            res.render('seo', {
                user: user.one,
                inquiries: user.two
            });
        };
    });

    /**
     * Находит пользоватей
     * 
     * @param {object} callback 
     * @return {user} объект пользователя
     */
    function first(callback) {
        async.parallel({
            one: (callback) => {
                User.find({
                    status: "client",
                    active: true,
                    'services.metrika.active': true
                }, (err, user) => {
                    if (err) {
                        console.error(err);
                    } else {
                        callback(null, user);
                    };
                });
            },
            two: (callback) => {
                User.find({
                    status: "client",
                    active: false
                }, (err, inquiries) => {
                    if (err) {
                        console.error(err);
                    } else {
                        callback(null, inquiries.length);
                    };
                });
            }
        }, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                callback(null, results);
            };
        });
    };
};