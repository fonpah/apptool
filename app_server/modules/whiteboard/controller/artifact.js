/**
 * Created by fonpah on 20.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
//var appSock = require('../../_common/controller/socket' ).getSocket();
var Artifact = Class.extend({
   init: function(db,appSocket){
       this.db = db;
       this.socket = appSocket;
       this.collection = this.db.collection('artifacts');
   } ,
   updateAction:function(req, res, next){
       var data = req.body.artifact;
       var me = this;
       var id = data._id;
       delete data._id;
       this.collection.update({_id:new mongodb.ObjectID(id)},{$set:data},{multi:false},function(err,record){
           if(err) return res.json({success:false,message:err.message});
           //appSock.broadcast.emit('artifact/update',{success:true,artifact:data});
            res.json({success:true,artifact:record});

       });
   },
   readAction:function(req, res, next){

    },
    deleteAction:function(req, res, next){
        var data = req.body.artifact;
        var me = this;
        this.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
            if(err) return res.json({success:false,message:err.message});
            //me.socket.broadcast.emit('artifact/delete',{success:true,artifact:data});
            return res.json({success:true,message:'ok'});
        });
    },
    createAction:function(req, res, next){
        var data = req.body.artifact;
        var me = this;
        delete data._id;
        this.collection.insert(data,function(err,record){
            if(err) return res.json({success:false,message:err.message});
            //me.socket.broadcast.emit('artifact/create',{success:true,artifact:record});
            return res.json({success:true,artifact:record[0]});
        });
    },
    listAction:function(req, res, next){
        var  id = req.param('id');
        if(!id){
            return res.json({success:false,message:'Invalid Id'});
        }
        this.collection.find({activityId : id } ).toArray(function(err, records){
            if(err) return res.json({success:false,message:err.message});
            return res.json({success:true,artifacts:records});
        });
    }
});
module.exports = Artifact;