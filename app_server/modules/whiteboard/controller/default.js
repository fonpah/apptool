/**
 * Created by fonpah on 02.05.2014.
 */
var DefaultCtrl = {
    indexAction: function ( req, res, next ) {
        return res.render( 'whiteboard/index' );
    },
    activityAction: function(req, res, next){
        var activity={
            _id:'534e35967492265c0e00000e',
            type:'create',
            status:1,
            role:{
                type:'member',
                actions:[]
            },
            title:'Identify problem',
            description:'Define the problem',
            artifacts:[],
            artifactPool:[]
        };
        return res.json({success:true, activity: activity});
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
    },
    saveWorkspaceAction: function(req, res, next){
        return res.json({success:true,message:'ok', data: req.body});
    },
    saveArtifactAction :function(req, res, next){

    }
};

module.exports = DefaultCtrl;