module.exports = function(req, res, next) {
    res.sendHttpError = function(error) {
        req.status(error.status);

        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.number("error", {error: error});
        }
    };
    next();
};