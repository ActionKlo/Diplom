var checkAuth = require('../middleware/checkAuth');
var checkAdmin = require('../middleware/checkAdmin');
var checkSeo = require('../middleware/checkSeo');

module.exports = (app) => {
    app.get('/', require('./frontpage').get);

    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);

    app.get('/signup', require('./signup').get);
    app.post('/signup', require('./signup').post);

    /* admin */
    app.get('/admin', checkAdmin, require('./admin').get);

    app.get('/admin/:id', checkAdmin, require('./adminId').get);

    /* seo */
    app.get('/seo', checkSeo, require('./seo').get);
    app.post('/seo', checkSeo, require('./seo').post);

    app.get('/seo/:id', checkSeo, require('./seoId').get);

    app.get('/inquiries', checkSeo, require('./inquiries').get);

    app.get('/inquiries/:id', checkSeo, require('./inquiriesId').get);
    app.post('/inquiries/:id', checkSeo, require('./inquiriesId').post);

    app.get('/user-registration', checkSeo, require('./user-registration').get);
    app.post('/user-registration', checkSeo, require('./user-registration').post);

    /* client */
    app.get('/id:id', checkAuth, require('./client').get);

    app.get('/verification&token=:id', require('./user-verification').get);
    app.post('/verification&token=:id', require('./user-verification').post);

    /* errors */
    app.get('/404', require('./404').get);

    app.use((req, res, next) => {
        res.status(404).render('./404');
    });
}