var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');

exports.get = (req, res) => {
    var id = req.params.id
    res.render('seoId', {
        id: id
    })
}