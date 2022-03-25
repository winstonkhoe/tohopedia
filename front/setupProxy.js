const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/',
    { target: 'https://tohopedia-app.herokuapp.com' } //your server
    ));
}