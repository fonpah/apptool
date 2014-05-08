/**
 * Created by fonpah on 06.05.2014.
 */
var db = require('../../../_server/appDatabase' ).db;
var activities = db.collection('activities');
var mongodb = require('mongodb' );
var ActivityCtrl = {
    activityAction: function(req, res, next){
        console.log(req.param('id'));
        activities.findOne({_id:new mongodb.ObjectID(req.param('id'))},{},function(err, doc){
            if(err) return res.json({success:false, message:err.message});
            if(!doc)return res.json({success:false, message:'Activity not found!'});

            return res.json({success:true, activity: doc});
        });

    },
    saveWorkspaceAction: function(req, res, next){
        var data = JSON.parse(req.body.workspace);
        activities.update({_id:new mongodb.ObjectID(req.param('id'))},{$set:{artifacts: data}},{multi:false},function(){
            return res.json({success:true,message:'ok', data: req.body.workspace});
        });
    },
    saveArtifactAction :function(req, res, next){
        var data = JSON.parse(req.body.data);
        activities.update({_id:new mongodb.ObjectID(req.param('id')),'artifacts.id':data.id},{$set:{'artifacts.$':data}},{multi:false},function(){
            return res.json({success:true,message:'ok', data: data});
        });
    },
    startAction: function(req, res, next){
        activities.update({_id:new mongodb.ObjectID(req.param('id'))},{$set:{status:1}},{},function(){
            return res.json({success:true,message:'ok'});
        });
    },
    stopAction: function(req, res, next){
        activities.update({_id:new mongodb.ObjectID(req.param('id'))},{$set:{status:2}},{},function(){
            return res.json({success:true,message:'ok'});
        });
    }
};

module.exports = ActivityCtrl;