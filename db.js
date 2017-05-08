var User = require('./models/user').User;

var user = new User({
    username: "Test",
    password: "secret"
});

user.save(function(err, user, affected) {
    User.find({username: "Test"}, function(err, tester) {
        console.log(tester);
    });
});