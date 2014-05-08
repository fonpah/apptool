/**
 * Created by fonpah on 02.05.2014.
 */

var defaultCtrl = require('../modules/whiteboard/controller/default');
var activityCtrl = require('../modules/whiteboard/controller/activity');
module.exports= function(app){
    app.get('/',function(req, res, next){
        defaultCtrl.indexAction(req, res, next);
    });
    app.get('/whiteboard',function(req, res, next){
        defaultCtrl.indexAction(req, res, next);
    });

    app.get('/whiteboard/activity/:id',function(req, res, next){
        activityCtrl.activityAction(req, res, next);
    });
    app.get('/whiteboard/property/form',function(req, res, next){
        defaultCtrl.propertyFormAction(req, res, next);
    });
    app.post('/whiteboard/save/:id',function(req, res, next){
        activityCtrl.saveWorkspaceAction(req, res, next);
    });
    app.post('/whiteboard/artifact/save/:id',function(req, res, next){
        activityCtrl.saveArtifactAction(req, res, next);
    });
    app.get('/whiteboard/activity/start/:id',function(req, res, next){
        activityCtrl.startAction(req, res, next);
    });
    app.post('/whiteboard/activity/stop/:id',function(req, res, next){
        activityCtrl.stopAction(req, res, next);
    });
    return app;
}