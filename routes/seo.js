var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

exports.get = (req, res) => {
    async.waterfall([
        first
    ], (err, user) => {
        if (err) {
            console.error(err);
        } else {
            res.render('seo', {
                user: user.one,
                report: user.two
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
                    active: true
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
                    active: true
                }, (err, user) => {
                    if (err) {
                        console.error(err);
                    } else {
                        var report = [];
                        var n = new Date().getMonth();

                        for (var i = 0; i < user.length; i++) {
                            let m = user[i].services.ap.reports[user[i].services.ap.reports.length - 1].date.getMonth();
                            let f = true

                            if (m === n) {
                                console.log("Месяцы равны");
                                console.log(m, " : ", n);
                            } else {
                                console.log("Месяцы не равны");
                                console.log(typeof (m), " : ", typeof (n));
                                console.log(m, " : ", n);
                                f = false
                            }
                            report.push(f);
                        }

                        console.log(report);
                        callback(null, report);
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

exports.post = (req, res, next) => {
    var form = new formidable.IncomingForm();
    
    form.multiples = false;

    form.uploadDir = path.join('reports');

    form.on('file', function (field, file) {
        console.log(file.path);
        console.log(file.name);
        console.log(file.type);
        console.log(file.hash);
        fs.rename(file.path, path.join(form.uploadDir, file.name + ".xls"));
    });

    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
}