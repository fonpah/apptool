/**
 * Created by fonpah on 02.05.2014.
 */
var db = require('../_server/appDatabase' ).db;
var appSocket = require('../modules/_common/controller/socket' ).getSocket();
var IndexCtrl = require('../modules/whiteboard/controller/index' );
var ActivityCtrl =  require('../modules/whiteboard/controller/activity');
var ArtifactCtrl = require('../modules/whiteboard/controller/artifact');
var ConnCtrl =  require('../modules/whiteboard/controller/connection');
var UserCtrl =  require('../modules/whiteboard/controller/user');
var CommentCtrl =  require('../modules/whiteboard/controller/comment');
var ContentCtrl = require('../modules/whiteboard/controller/content');

module.exports= function(app){
    var indexCtrl = new IndexCtrl(db,appSocket);
    var activityCtrl = new ActivityCtrl(db,appSocket);
    var artifactCtrl = new ArtifactCtrl(db,appSocket);
    var connCtrl = new ConnCtrl(db, appSocket);
    var userCtrl = new UserCtrl(db, appSocket);
    var commentCtrl = new CommentCtrl(db, appSocket);
    var contentCtrl = new ContentCtrl(db,appSocket);
    app.get('/',function(req, res, next){
        indexCtrl.indexAction(req, res, next);
    });
    app.get('/whiteboard/:id',function(req, res, next){
        indexCtrl.readAction(req, res, next);
    });

    app.get('/activity/read',function(req, res, next){
        activityCtrl.readAction(req, res, next);
    });
    app.get('/user/read',function(req, res, next){
        userCtrl.readAction(req,res, next);
    });
    app.get('/whiteboard/property/form',function(req, res, next){
        indexCtrl.propertyFormAction(req, res, next);
    });


    app.get('/artifacts',function(req, res, next){
        artifactCtrl.listAction(req, res, next);
    });
    app.post('/artifact/create',function(req, res, next){
        artifactCtrl.createAction(req, res, next);
    });
    app.post('/artifact/update',function(req, res, next){
        artifactCtrl.updateAction(req, res, next);
    });
    app.post('/artifact/delete',function(req, res, next){
        artifactCtrl.deleteAction(req, res, next);
    });

    app.get('/connections',function(req, res, next){
        connCtrl.listAction(req, res, next);
    });
    app.post('/connection/create',function(req, res, next){
        connCtrl.createAction(req, res, next);
    });
    app.post('/connection/update',function(req, res, next){
        connCtrl.updateAction(req, res, next);
    });
    app.post('/connection/delete',function(req, res, next){
        connCtrl.deleteAction(req, res, next);
    });

    app.get('/comment/read',function(req, res, next){
        commentCtrl.readAction(req, res, next);
    });
    app.post('/comment/create',function(req, res, next){
        commentCtrl.createAction(req, res, next);
    });
    app.post('/comment/update',function(req, res, next){
        commentCtrl.updateAction(req, res, next);
    });
    app.post('/comment/delete',function(req, res, next){
        commentCtrl.deleteAction(req, res, next);
    });

    app.get('/content/read',function(req, res, next){
        contentCtrl.readAction(req, res, next);
    });
    app.post('/content/create',function(req, res, next){
        contentCtrl.createAction(req, res, next);
    });
    app.post('/content/update',function(req, res, next){
        contentCtrl.updateAction(req, res, next);
    });
    app.post('/content/delete',function(req, res, next){
        contentCtrl.deleteAction(req, res, next);
    });
    return app;
}