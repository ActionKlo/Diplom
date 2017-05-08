exports.get = (req, res) => {
    var id = req.params.id;

    res.render('inquiriesId', {
        id: id
    })
}