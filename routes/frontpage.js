var request = require('request');
var fs = require('fs');
var XLSX = require('xlsx');

exports.get = (req, res) => {
    var url = req.originalUrl;
    console.time(url);

    res.render('index', {});



    
    var workbook = XLSX.readFile('public/img/testAP1.xls');
    var sheet_name_list = workbook.SheetNames;
    var ws = workbook.Sheets[sheet_name_list[0]];

    var r = XLSX.utils.sheet_to_json(ws, {header: 1});

    for (var i = 6; i < r.length; i++) {
        console.log(r[i][0] + " : " + r[i][2] + " / " + r[i][3]);
    }

    // r.forEach(function (r) {
    //     console.log(r[0] + " : " + r[2] + " / " + r[3]);
    // });
    






    // // var purl = "http://allpositions.ru/user/enter/";
    // // request.post();

    // // request({
    // //     // will be ignored
    // //     method: 'GET',
    // //     uri: 'http://www.google.com',

    // //     // HTTP Archive Request Object
    // //     enter: {
    // //         url: 'http://allpositions.ru/user/enter/',
    // //         method: 'POST',
    // //         headers: [{
    // //             'Host': 'allpositions.ru',
    // //             'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0',
    // //             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    // //             'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
    // //             'Accept-Encoding': 'gzip, deflate',
    // //             'Content-Type': 'application/x-www-form-urlencoded',
    // //             'Content-Length': '81',
    // //             'Referer': 'http://allpositions.ru/',
    // //             'Upgrade-Insecure-Requests': '1'
    // //         }],
    // //         postData: {
    // //             mimeType: 'application/x-www-form-urlencoded',
    // //             params: [{
    // //                     name: 'email',
    // //                     value: 'nastarte.by@gmail.com'
    // //                 },
    // //                 {
    // //                     name: 'вход',
    // //                     value: 'вход'
    // //                 },
    // //                 {
    // //                     name: 'password',
    // //                     value: 'ivka-opa-pa'
    // //                 }
    // //             ]
    // //         }
    // //     }
    // // });


    // var options = {
    //     url: 'http://allpositions.ru/user/enter/',
    //     method: 'POST',
    //     headers: {
    //         'Host': 'allpositions.ru',
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0',
    //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    //         'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
    //         'Accept-Encoding': 'gzip, deflate',
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': '81',
    //         'Referer': 'http://allpositions.ru/',
    //         'Cookie': 'per_page=50; _ym_uid=1495388239587515179; _ym_isad=1; __utma=116701654.1303346047.1495388242.1495388242.1495399865.2; __utmz=116701654.1495388242.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); sp_table=id_query; sp_desc=1; __utmc=116701654; __utmb=116701654.4.10.1495399865; __utmt=1; ci_session=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%22e3869349825c515bac3007e9b51528d4%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A12%3A%2293.125.56.32%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A50%3A%22Mozilla%2F5.0+%28Windows+NT+6.3%3B+WOW64%3B+rv%3A53.0%29+Gecko%22%3Bs%3A13%3A%22last_activity%22%3Bs%3A10%3A%221495399947%22%3Bs%3A7%3A%22refpath%22%3Bs%3A0%3A%22%22%3B%7Df6c7380d7cc7eaf9bf15258cdd10c7a8',
    //         'Connection': 'keep-alive',
    //         'Upgrade-Insecure-Requests': '1'
    //     }
    //     // parameters: {
    //     //     'email': 'nastarte.by@gmail.com',
    //     //     'вход': 'вход',
    //     //     'password': 'ivka-opa-pa'
    //     // }
    // };

    // function callback(error, response, body) {
    //     console.log(error);
    //     console.log(response.statusCode);
    //     console.log(response.headers['content-type']);
    //     console.log(body);
    //     // if (!error && response.statusCode == 200) {
    //     //     var info = JSON.parse(body);
    //     //     console.log(info.stargazers_count + " Stars");
    //     //     console.log(info.forks_count + " Forks");
    //     // }
    // }

    // request(options, callback).on('response', function (response) {
    //     var url1 = "http://allpositions.ru/reports/site_position/export_sp/572718/18.03.2017%20-%2017.04.2017/0/1495387848470";

    //     request.get(url1).on('response', function (response) {
    //         console.log(response.statusCode) // 200 
    //         console.log(response.headers['content-type']) // 'image/png' 
    //     }).pipe(fs.createWriteStream('public/img/testAP.xls'));
    // });
    // // request.post(options).on('response', function (response) {
    // //     console.log(response.statusCode) // 200 
    // //     console.log(response.headers['content-type']) // 'image/png' 
    // // });

    // // var url = "http://allpositions.ru/reports/site_position/export_sp/39/21.04.2017%20-%2021.05.2017/0/1495383140923";
    // // var url = "https://trello-attachments.s3.amazonaws.com/57a894410d3e5cd19ccdc8fe/5921c54f8797a4fe83d17537/46f7caa842a6115ce1d8e389984d074c/export_(1).xls";
    // // var url = "http://todrik.me/1.xlsx";

    // // request({
    // //     url: url,
    // //     method: 'GET'
    // // }, (error, response, result) => {
    // //     console.log(error);
    // //     // console.log(response);
    // //     console.log(result);
    // // })


    // // request.get('http://allpositions.ru/user/enter/').auth('nastarte.by@gmail.com', 'ivka-opa-pa', false).on('response', function (response) {
    // //     console.log(response.statusCode) // 200 
    // //     console.log(response.headers['content-type']) // 'image/png' 
    // // });

    console.timeEnd(url);
};