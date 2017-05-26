var User = require('../models/user').User;

exports.get = (req, res) => {
    var id = req.params.id;

    User.findOne({
        '_id': id
    }, (err, user) => {
        if (!user) {
            return res.status(404).render('404');
        }

        res.render('user-varification', {
            id: id
        });
    })
}

exports.post = (req, res, next) => {
    var id = req.body.value;
    var newPassword = req.body.password;
    
    User.findById(id, (err, user) => {
        user.password = newPassword;
        user.active = true;
        user.dateActive = new Date();

        user.save((err, resUser) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Пароль изменен");
            }
        })
    });
}