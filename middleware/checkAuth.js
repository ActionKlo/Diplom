module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.status(404).render('./404');
    }

    next();
};