/**
 * Created by fonpah on 02.05.2014.
 */

var defaultCtrl = require('../modules/whiteboard/controller/default');
module.exports= function(app){
    app.get('/',function(req, res, next){
        defaultCtrl.indexAction(req, res, next);
    });
    app.get('/whiteboard',function(req, res, next){
        defaultCtrl.indexAction(req, res, next);
    });

    app.get('/whiteboard/activity/:id',function(req, res, next){
        defaultCtrl.activityAction(req, res, next);
    });
    app.get('/whiteboard/property/form',function(req, res, next){
        defaultCtrl.propertyFormAction(req, res, next);
    });
    app.post('/whiteboard/save/:id',function(req, res, next){
        defaultCtrl.saveWorkspaceAction(req, res, next);
    });
    app.post('/whiteboard/artifact/save/:id',function(req, res, next){
        defaultCtrl.saveArtifactAction(req, res, next);
    });
    return app;
}