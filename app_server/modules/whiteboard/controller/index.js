/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
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
        return res.render( 'whiteboard/index',{activityId:'5368e07d90c5351ba9722df9',userId:'1234d5d6e87e98tzh31s97arz56478r'} );
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