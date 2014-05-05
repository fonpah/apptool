
exports.setConfig = function (express, path, next) {
    var app = express();
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/../view_templates');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('arandomword_521253'));
        app.use(express.session());
        app.use(express.static(path.join(__dirname, '/../../app_client')));
        //app.use(app.router); note any middleware use after this setting is not called . so commenting will cause express do add router the moment it encouters a route. this helps to make sure that middlewares includin custom ones are also called
    });

    //env specific config
    app.configure('development', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function () {
        app.use(express.errorHandler());
    });
    next(app);
};







