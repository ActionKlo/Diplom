exports.get = (req, res) => {
    var url = req.originalUrl;
    console.time(url);
    
    res.render('index', {});
    
    console.timeEnd(url);
};