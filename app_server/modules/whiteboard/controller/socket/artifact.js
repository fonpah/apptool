/**
 * Created by fonpah on 21.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Artifact = Class.extend({
    init: function(db,appSocket){
        var me = this;
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('artifacts');
        this.socket.on('client/artifact/create',function(data){me.createAction(data);});
        this.socket.on('client/artifact/update', function(data){me.updateAction(data);});
        this.socket.on('client/artifact/delete', function(data){me.deleteAction(data);});
    } ,
    updateAction:function(data){
        var me = this;
        var id = data._id;
        delete data._id;
        me.collection.update({_id:new mongodb.ObjectID(id)},{$set:data},{multi:false},function(err,record){
            if(err) return me.socket.emit('server/artifact/update/feedback',{success:false,message:err.message});
            me.socket.emit('server/artifact/update/feedback',{success:true,artifact:{_id:id}});
            data._id = id;
            me.socket.broadcast.emit('server/artifact/updated',{success:true,artifact:data});

        });
    },
    deleteAction:function(data){
        var me = this;
        this.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
            if(err) return me.socket.emit('server/artifact/delete/feedback',{success:false,message:err.message});
            me.socket.emit('server/artifact/delete/feedback',{success:true,artifact:data});
            me.socket.broadcast.emit('server/artifact/deleted',{success:true,artifact:data});
        });
    },
    createAction:function(data){
        var me = this;
        delete data._id;
        this.collection.insert(data,function(err,record){
            if(err) return me.socket.emit('server/artifact/create/feedback',{success:false,message:err.message});
            me.socket.emit('server/artifact/create/feedback',{success:true,artifact:record[0]});
            me.socket.broadcast.emit('server/artifact/created',{success:true,artifact:record[0]});
        });
    },
    removeListeners:function(){
        this.socket.removeAllListeners('client/artifact/create');
        this.socket.removeAllListeners('client/artifact/delete');
        this.socket.removeAllListeners('client/artifact/update');

    }
    /*,
    listAction:function(req, res, next){
        var  id = req.param('id');
        if(!id){
            return res.json({success:false,message:'Invalid Id'});
        }
        this.collection.find({activityId : id } ).toArray(function(err, records){
            if(err) return res.json({success:false,message:err.message});
            return res.json({success:true,artifacts:records});
        });
    }*/
});
module.exports = Artifact;