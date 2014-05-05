/**
 * Created by NONGHO on 09.02.14.
 */
exports.setBasicAuthConfig = function( app ){
    var auth = require('http-auth');
    var basic = auth.basic({
        realm: "whiteboard app",
        file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass ...
    });
    app.use(auth.connect(basic));


    return app;
}