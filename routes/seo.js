var User = require('../models/user').User;
var async = require('async');
var mongoose = require('mongoose');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var XLSX = require('xlsx');
var config = require('../config');

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

                            if (m !== n) {
                                f = false
                            }
                            report.push(f);
                        }

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
        var date = new Date();
        date = date.getMonth() + "-" + date.getFullYear();
        var newFileName = date;
        console.log(file.type);
        var id = file.name;

        // fs.exists('/etc/passwd', (exists) => {
        //     console.log(exists ? 'it\'s there' : 'no passwd!');
        // });
        if (file.type !== "application/vnd.ms-excel" && file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            fs.unlink(file.path);
            res.status(500).send("Неверный тип файла");
            return res.end();
        }

        // Если файл нужного типа то он сохраняется
        var type = (file.type === "application/vnd.ms-excel") ? ".xls" : ".xlsx";
        console.log(type);

        var path = 'reports/' + file.name + "/" + newFileName + type;
        console.log(path);

        //Таперь сам парсинг файла
        var workbook = XLSX.readFile(file.path);
        var sheet_name_list = workbook.SheetNames;
        var ws = workbook.Sheets[sheet_name_list[0]];

        var r = XLSX.utils.sheet_to_json(ws, {
            header: 1
        });


        if (!r[0][0] || !r[1][0]) {
            return res.status(500).send("Невалидный файл").end();
        }
        // Строка с сайтом в отчёте
        console.log(r[0][0]);
        // Строка с датой в отчёте
        console.log(r[1][0]);


        User.findOne({
            '_id': id
        }, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err).end();
            }

            var urlRegex = new RegExp(config.get('regex:ap:url'));

            var dbSite = urlRegex.exec(user.site);
            var reportSite = urlRegex.exec(r[0][0]);

            // console.log(reportSite[1]);

            var a = dbSite[3] + "." + dbSite[4];
            var b = reportSite[3] + "." + reportSite[4];

            // console.log(a, " : ", b);
            if (a !== b) {
                fs.unlink(file.path);
                res.status(500).send("Сайт в отчёте не совпадает с сайтом пользователя");
                return res.end();
            }

            var dateRegex = new RegExp(config.get('regex:ap:date'));

            var d = new Date().getDate();
            var m = new Date().getMonth();
            var y = new Date().getFullYear();
            var reportDate = dateRegex.exec(r[1][0]);

            // console.log(reportDate[1], "-", parseInt(reportDate[2]), "-", reportDate[3]);
            // console.log(d, "-", (parseInt(m) + 1), "-", y);

            if (d != reportDate[1] || (parseInt(m) + 1) != parseInt(reportDate[2]) || y != reportDate[3]) {
                fs.unlink(file.path);
                res.status(500).send("Отчёт устарел");
                return res.end();
            }

            var data = [];
            for (var i = 6; i < r.length; i++) {
                console.log(r[i][0] + " : " + r[i][2] + " / " + r[i][3]);
                data.push({
                    inquiry: r[i][0],
                    frequency: r[i][1],
                    yp: r[i][2],
                    gp: r[i][3]
                })
            }

            var qwe = new Date();
            user.update({
                $push: {
                    'services.ap.reports': {
                        date: qwe,
                        data: data,
                        sum: "15",
                        discount: "0",
                        totalSum: "15"
                    }
                }
            }, (err, resu) => {
                console.log(err);
                console.log("--------=--------");
                console.log(resu);

                fs.rename(file.path, path);
                return res.end('success');
            });
        });





        // if (r[6][2] != 6) {
        //     fs.unlink(file.path);
        //     res.status(500).send("Невалидный файл");
        //     return res.end();
        // }

        // Возвращает 200 полюбому, поэтому эта страка должна быть в конце
        // fs.rename(file.path, path);

        // res.status(500).send("Отчёт не загрузился");
        // return res.end();
        // function func() {
        //     console.log("Спустя 10 секунд");
        //     // fs.unlink(p);
        // }
        // setTimeout(func, 10000);
    });

    // form.on('error', function (err) {
    //     console.log('An error has occured: \n' + err);

    //     res.status(500).send(err);
    //     return res.end();
    // });

    // // once all the files have been uploaded, send a response to the client
    // form.on('end', function () {
    //     res.end('success');
    // });

    // parse the incoming request containing the form data
    form.parse(req);
}