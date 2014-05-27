/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Index = Class.extend({
    init: function(db, appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('users2activities');
    } ,
    indexAction: function(req, res, next){
      res.render('alert/error',{title:'Application Tool',msg:'Page not found!'});
    },
    updateAction:function(req, res, next){

    },
    readAction:function(req, res, next){
        var  id = req.params.id;
        if(!id){
            return  res.render('alert/error',{title:'Application Tool',msg:'Page not found!'});
        }
        this.collection.findOne({_id:new mongodb.ObjectID(id)},function(err,record){
            if(err) return res.render('alert/error',{title:'Application Tool',msg:'Page not found!'});
            if(!record){
                return  res.render('alert/error',{title:'Application Tool',msg:'Page not found!'});
            }
            console.log(record);
            return res.render( 'whiteboard/index',{activityId:record.activityId,userId:record.userId} );

        });

    },
    deleteAction:function(req, res, next){

    },
    createAction:function(req, res, next){

    },
    listAction:function(req, res, next){

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
});
module.exports = Index;