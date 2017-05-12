exports.get = (req, res) => {
    var id = req.params.id;

    res.render('inquiriesId', {
        id: id
    })
};

exports.post = (req, res, next) => {
    var mId = req.body.mId;
    var mDate = req.body.mDate;
    var aId = req.body.aId;
    var gId = req.body.gId;

    console.log("mId: " + mId);
    console.log("mDate: " + mDate);
    console.log("aId: " + aId);
    console.log("gId: " + gId);

    console.log(req.params.id);

}