/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Comment = Class.extend({
    init: function(db, appSocket){
        this.db = db;
        this.socket= appSocket;
        this.collection = this.db.collection('comments');
    } ,
    updateAction:function(req, res, next){

    },
    readAction:function(req, res, next){

    },
    deleteAction:function(req, res, next){

    },
    createAction:function(req, res, next){

    },
    listAction:function(req, res, next){
        var  id = req.param('id');
        if(!id){
            return res.json({success:false,message:'Invalid Id'});
        }
        this.collection.find({_id : new mongodb.ObjectID(id) } ).toArray(function(err, records){
            if(err) return res.json({success:false,message:err.message});
            return res.json({success:true,comments:records});
        });
    }
});
module.exports = Comment;