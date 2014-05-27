/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var User = Class.extend({
    init: function(db,appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('users');
    } ,
    updateAction:function(req, res, next){

    },
    readAction:function(req, res, next){
        var  id = req.param('id');
        if(!id){
            return res.json({success:false,message:'Invalid Id'});
        }
        this.collection.findOne({_id:new mongodb.ObjectID(id)},function(err,record){
            if(err) return res.json({success:false,message:err.message});
            res.json({success:true,user:record||{}});

        });
    },
    deleteAction:function(req, res, next){

    },
    createAction:function(req, res, next){

    },
    listAction:function(req, res, next){

    }
});
module.exports = User;