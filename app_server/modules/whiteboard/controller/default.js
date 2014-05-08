/**
 * Created by fonpah on 02.05.2014.
 */
    var db = require('../../../_server/appDatabase' ).db;
    var activities = db.collection('activities');
    var mongodb = require('mongodb' );
var DefaultCtrl = {
    indexAction: function ( req, res, next ) {
        return res.render( 'whiteboard/index',{type:req.query.type} );
    },
    activityAction: function(req, res, next){
        console.log(req.param('id'));
       activities.findOne({_id:new mongodb.ObjectID(req.param('id'))},{},function(err, doc){
           if(err) return res.json({success:false, message:err.message});
           if(!doc)return res.json({success:false, message:'Activity not found!'});

           return res.json({success:true, activity: doc});
       });

    },
    propertyFormAction: function(req, res, next){
        var form ={
            "_id" : "5340238f776d6fb7faa5af38",
            "title" : "Form 2",
            "fields" : [
                {
                    "fieldLabel" : "Title",
                    "name" : "title",
                    "anchor" : "100%",
                    "xtype" : "textfield",
                    "required" : true,
                    "listeners": {
                        "change":"changeTitle"
                    }
                },
                {
                    "fieldLabel" : "Description",
                    "name" : "description",
                    "anchor" : "100%",
                    "xtype" : "textareafield",
                    "required" : true,
                    "listeners": {
                        "change":"changeDescription"
                    }
                }
            ],
            "buttons" : [
                {
                    "text" : "Save",
                    "xtype" : "button",
                    "handler" : "save"
                },
                {
                    "text" : "Cancel",
                    "xtype" : "button",
                    "handler" : "reset"
                }
            ]
        };
        return res.json({success:true,form:form});
    }
};

module.exports = DefaultCtrl;