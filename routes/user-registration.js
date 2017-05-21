var User = require('../models/user').User;
var async = require('async');

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

    async.waterfall([
        first,
        second
    ], (err, results) => {
        console.log(err);
        console.log("====================================");
        console.log(results);
        res.end();
    });

    /**
     * 
     * @param {object} callback 
     */
    function first(callback) {
        var user = new User({
            'name': name,
            'company': company,
            'urlSite': site,
            'phone': phone,
            'email': email,
            'password': password
        });

        user.save((err) => {
            if (err) {
                console.log(err.message);
                res.status(500).send( {
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
    function second(user, callback) {
        User.findOne({
            'name': name,
            'company': company,
            'urlSite': site,
            'phone': phone,
            'email': email,
        }, (err, resUser) => {
            if (err) {
                console.log(err);
            } else {
                console.log(resUser);
                var url = "/verification&token=" + resUser.id;
                console.log(url); 

                callback(null, url);
            }
        })
    };
}