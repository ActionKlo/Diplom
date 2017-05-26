var User = require('../models/user').User;
var async = require('async');
var fs = require('fs');
var config = require('../config');
var request = require('request');

exports.get = (req, res) => {
    res.render('user-registration');
}

exports.post = (req, res, next) => {
    var name = req.body.name;
    var company = req.body.company;
    var site = req.body.site;
    var phone = req.body.phone;
    var email = req.body.email;
    var password = Math.random();
    var mId = req.body.mId;

    async.waterfall([
        first,
        second,
        third
    ], (err, results) => {
        console.log(err);
        console.log("====================================");
        console.log(results);
        res.end();
    });

    function first(callback) {
        var url = "https://api-metrika.yandex.ru/management/v1/counters?oauth_token=" + config.get('yametrika:oauth');

        request({
            url: url,
            method: 'GET'
        }, (err, response, result) => {
            if (err) {
                console.log(err);
            }
            console.log(response.statusCode);

            var r = JSON.parse(result);

            for (var i = 0; i < r.counters.length; i++) {
                if (r.counters[i].id == mId) {
                    // var regex1 = /^(https?:\/\/)?([\da-z\.-]+\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                    var regex = new RegExp(config.get('regex:url'));

                    var yaSite = regex.exec(r.counters[i].site);
                    var s = regex.exec(site);

                    var a = yaSite[3] + "." + yaSite[4];
                    var b = s[3] + "." + s[4];

                    if (a === b) {
                        var create_time = r.counters[i].create_time
                        return callback(null, create_time);
                    } else {
                        console.log(444, "Сайт в счётчике не совпадает с введённым!");
                        res.status(444).send("Сайт в счётчике не совпадает с введённым!");
                        return res.end();
                    }
                }
            }

            console.log(444, "Счётчик не найден!");
            res.status(444).send("Счётчик не найден!");
            return res.end();
        })
    }

    /**
     * 
     * @param {object} callback 
     */
    function second(create_time, callback) {
        var dateReg = new Date();
        // var dateReg = date.getDate + "." + date.getMonth + "." + date.getFullYear;
        console.log(dateReg);

        var user = new User({
            'name': name,
            'company': company,
            'site': site,
            'phone': phone,
            'email': email,
            'password': password,
            'dateReg': dateReg,
            'services.metrika.id': mId,
            'services.metrika.create_time': create_time
        });

        user.save((err) => {
            if (err) {
                console.log(err);
                console.log(err.message);
                res.status(500).send({
                    'err': err.message
                });
                // \$([a-zA-Z]+) -===- добавить регулярное выражение
                res.end();
            } else {
                callback(null, user);
            }
        });
    };

    /**
     * 
     * @param {object} user 
     * @param {object} callback 
     */
    function third(user, callback) {
        User.findOne({
            'name': name,
            'company': company,
            'site': site,
            'phone': phone,
            'email': email,
        }, (err, resUser) => {
            if (err) {
                console.log(err);
            } else {
                var dir = "reports/" + resUser.id;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                console.log(resUser);
                var url = "/verification&token=" + resUser.id;
                console.log(url);

                callback(null, url);
            }
        })
    };
}