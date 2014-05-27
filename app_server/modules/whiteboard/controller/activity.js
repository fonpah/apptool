/**
 * Created by fonpah on 06.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Activity = Class.extend({
    init: function(db,appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection= this.db.collection('activities')
    } ,
    updateAction:function(req, res, next){

    },
    readAction:function(req, res, next){
        this.collection.findOne({_id:new mongodb.ObjectID(req.param('id'))},{},function(err, doc){
            if(err) return res.json({success:false, message:err.message});
            if(!doc)return res.json({success:false, message:'Activity not found!'});
            return res.json({success:true, activity: doc});
        });
    },
    deleteAction:function(req, res, next){

    },
    createAction:function(req, res, next){

    },
    listAction:function(req, res, next){

    }
});
module.exports = Activity;
