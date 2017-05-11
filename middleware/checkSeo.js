var User = require('../models/user').User;

module.exports = (req, res, next) => {
    var id = req.session.user
    if (!id) {
        return res.status(404).render('./404');
    } else {
        User.find({
            _id: id,
            status: "seo"
        }, (err, user) => {
            console.log(id);
            console.error(err);
            console.log(user);

            if (!user.length) {
                return res.status(404).render('./404');
            };

            next();
        })
    }
}