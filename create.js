var mongoose = require('./libs/mongoose');
var async = require('async');
var User = require('./models/user').User;

// 1. Drop DataBase 
// 2. create & save 3 users
// 3. close connection

//test

mongoose.connection.on('open', function () {
	var db = mongoose.connection.db;
	db.dropDatabase(function (err) {
		if (err) throw err;

		async.parallel([
			function (callback) {
				var user1 = new User({
					name: "admin",
					password: "123",
					active: true,
					status: "admin"
				});
				user1.save(function (err) {
					callback(err, user1);
				});
			},
			function (callback) {
				var user2 = new User({
					name: "seo",
					password: "123",
					active: true,
					status: "seo"
				});
				user2.save(function (err) {
					callback(err, user2);
				});
			},
			function (callback) {
				var dateReg = new Date();

				var user3 = new User({
					name: "client1",
					company: "nivasan",
					site: "dvdom.by",
					phone: "+375292863300",
					email: "fingerbord2013@yandex.by",
					password: "123",
					dateReg: dateReg,
					'services.metrika.id': "35848795",
					'services.metrika.create_time': dateReg,
					active: true,
					status: "client"
				});
				user3.save(function (err) {
					callback(err, user3);
				});
			}
		], function (err, results) {
			mongoose.disconnect();
		});
	});
});