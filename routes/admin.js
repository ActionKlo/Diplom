var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');
var config = require('../config');
var request = require('request')

exports.get = (req, res) => {
    async.waterfall([
            first,
            second,
            third,
        ], (err, user, id, result) => {
            result = JSON.parse(result);

            res.render('admin', {
                user: user,
                result: result
            })
        });

    /**
     * Возвращает найденных в бд пользователей
     * 
     * @param {object} callback
     * @return {object} всех найденных пользователей
     */
    function first(callback) {
        User.find({
            status: "client",
            active: true,
            'services.metrika.active': true
        }, (err, res) => {
            if (err) {
                res.end(err);
            };

            console.log("First function complete!");
            callback(null, res);
        })
    };

    /**
     * Возвращает ид метрики каждого пользователя
     * 
     * @param {object} user 
     * @param {object} callback 
     * @return {object} пользователей
     * @return {array} id яндекс-метрики в массиве
     */
    function second(user, callback) {
        if (user !== null) {
            var id = new Array();
            for (var i = 0; i < user.length; i++) {
                id[i] = user[i].services.metrika.id;
            };

            console.log("Second function complete!");
            callback(null, user, id);
        };
    };

    /**
     * Получает данные GET запроса к метрике
     * 
     * @param {object} user 
     * @param {array} id 
     * @param {object} callback 
     */
    function third(user, id, callback) {
        var date = new Date();
        var year1 = date.getFullYear();
        var year2 = date.getFullYear();
        var month1 = date.getMonth();
        var month2 = month1;

        if (month1 === 0) {
            month1 = 12;
            year1--;
            month2 = 0;
        }

        var date1 = year1 + "-" + month1 + "-" + 1;
        var date2 = year2 + "-" + (month2 + 1) + "-" + 1;
        id = id.join();
        
        var url = "https://api-metrika.yandex.ru/stat/v1/data/bytime?ids=35848795&metrics=ym:s:pageviews,ym:s:bounceRate&date1=" + date1 + "&date2=" + date2 + "&group=day&oauth_token=" + config.get("yametrika:oauth");
        request({
            method: 'GET',
            url: url
        }, (error, response, result) => {
            // ------------------ добавить if (error) {}; ------------------
            
            console.log("Third function complete!");
            if (!error && response.statusCode == 200) {
                callback(null, user, id, result);
            };
        });
    };
};