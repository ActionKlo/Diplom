var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');

exports.get = (req, res) => {
    async.waterfall([
        first
    ], (err, user) => {
        console.log(user);

        var name = [],
            company = [],
            phone = [],
            site = [],
            email = [];

        for (var i = 0; i < user.length; i++) {
            name.push([
                user[i].name
            ]);
            company.push([
                user[i].company
            ]);
            phone.push([
                user[i].phone
            ]);
            site.push([
                user[i].urlSite
            ]);
            email.push([
                user[i].email
            ]);
        }
        console.log(typeof(name) + typeof(company) + typeof(phone) + typeof(site) + typeof(email));
        // name = JSON.parse(JSON.stringify(name));

        res.render('inquiries', {
            user: user,
            name: name,
            company: company,
            phone: phone,
            site: site,
            email: email
        });
    });

    function first(callback) {
        User.find({
            active: false
        }, (err, user) => {
            if (err) {
                console.error(err);
            } else {
                callback(null, user);
            };
        });
    };
}