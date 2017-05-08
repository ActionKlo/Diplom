var mongoose = require('./libs/mongoose');
var async = require('async');
var User = require('./models/user').User;

// 1. Drop DataBase 
// 2. create & save 3 users
// 3. close connection

//test commit

mongoose.connection.on('open', function () {
	var db = mongoose.connection.db;
	db.dropDatabase(function (err) {
		if (err) throw err;

		async.parallel([
			function (callback) {
				var user1 = new User({
					username: "User1",
					password: "123"
				});
				user1.save(function (err) {
					callback(err, user1);
				});
			},
			function (callback) {
				var user2 = new User({
					'username': "Test1",
					'phonenumber': "testPhone1",
					'email': "test1@test.com",
					'urlSite': "test1.com",
					'password': "123"
				});
				user2.save(function (err) {
					callback(err, user2);
				});
			},
			function (callback) {
				var user3 = new User({
					username: "User3",
					password: "123"
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