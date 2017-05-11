var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');
var config = require('../config');
var request = require('request');

exports.get = (req, res) => {
    var id = req.params.id

    async.waterfall([
        first,
        second
    ], (err, user, results) => {
        var results = JSON.parse(results.one);
        console.log(user + " : " + results);
        console.log(typeof (user) + " : " + typeof (results));
        res.render('adminId', {
            id: id,
            user: user,
            results: results
        });
    });

    /**
     * Находит пользователя в базе по ID метрики
     * 
     * @param {object} callback
     * 
     * @return {user} найденного пользователя
     */
    function first(callback) {
        User.findOne({
            'services.metrika.id': id
        }, (err, res) => {
            console.error(err);
            if (err) {
                res.end();
            };

            callback(null, res);
        })
    };

    /**
     * Выполняет GET запрос к метрике
     * 
     * @param {object} user 
     * @param {object} callback 
     * 
     * @return {user} пользователя
     * @return {result} результат GET запроса
     */
    function second(user, callback) {
        if (user === null) {
            return res.redirect('/404');
        };
        //https://api-metrika.yandex.ru/stat/v1/data/bytime?ids=35848795&metrics=ym:s:visits,ym:s:pageviews,ym:s:users&date1=2017-3-1&date2=2017-4-1&group=day&oauth_token=AQAAAAAc5T6UAAQuh_qHr7JOGUyhmi72Rc5RVVM

        // Добавить дату деактивации (при условии что она есть)


        var date = new Date();
        var date1 = user.services.metrika.dateActive;
        date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
        var date2 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        console.log(date1 + " : " + date2);

        async.parallel({
            one: (callback2) => {

                var url = "https://api-metrika.yandex.ru/stat/v1/data/bytime?ids=" + id + "&metrics=ym:s:visits,ym:s:pageviews,ym:s:users&date1=" + date1 + "&date2=" + date2 + "&group=day&oauth_token=" + config.get('yametrika:oauth');

                request({
                    url: url,
                    method: 'GET'
                }, (error, responce, result) => {
                    if (!error && responce.statusCode == 200) {
                        callback2(null, result);
                    } else {
                        console.log("Опа: " + error + " : " + responce.statusCode);
                    }
                })
            }
        }, (err, results) => {
            // --------------------------------- Добавить if (err) ---------------------------------- //
            callback(null, user, results);
        });
    }
}