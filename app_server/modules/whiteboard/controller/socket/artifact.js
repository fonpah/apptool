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
        this.socket.on('/artifact/create',function(data){me.createAction(data);});
        this.socket.on('/artifact/update', function(data){me.updateAction(data);});
        this.socket.on('/artifact/delete', function(data){me.deleteAction(data);});
        this.socket.on('/artifacts', function(data){me.listAction(data);});
    } ,
    updateAction:function(data){
        var me = this;
        var id = data._id;
        delete data._id;
        me.collection.findAndModify({_id:new mongodb.ObjectID(id)},[],{$set:data},{new:true},function(err, doc){
            if(err) return me.socket.emit('/artifact/update',{success:false,message:err.message});
             me.socket.broadcast.emit('/artifact/update',{success:true,artifact:doc});
             me.socket.emit('/artifact/update',{success:true,message:'ok'});
        });
    },
    deleteAction:function(data){
        var me = this;
        this.collection.findOne({_id:new mongodb.ObjectID(data._id)},function(err,doc){
            if(err) return me.socket.emit('/artifact/delete',{success:false,message:err.message});
            var model= doc;
            me.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
                if(err) return me.socket.emit('/artifact/delete',{success:false,message:err.message});
                me.socket.emit('/artifact/delete',{success:true,artifact:data});
                me.socket.broadcast.emit('/artifact/delete',{success:true,artifact:model});
            });

        });
    },
    createAction:function(data){
        var me = this;
        this.collection.insert(data,function(err,records){
            if(err) return me.socket.emit('/artifact/create',{success:false,message:err.message});
            me.socket.emit('/artifact/create',{success:true,artifact:records});
            me.socket.broadcast.emit('/artifact/create',{success:true,artifact:records});
        });
    },
    removeListeners:function(){
        this.socket.removeAllListeners('/artifact/create');
        this.socket.removeAllListeners('/artifact/delete');
        this.socket.removeAllListeners('/artifact/update');
        this.socket.removeAllListeners('/artifacts');

    },
    listAction:function(data){
        var me = this;
        var  id = data.activityId;
        if(!id){
            return this.socket.emit('/artifacts',{success:false,message:'Invalid Id'});
        }
        this.collection.find({activityId : id } ).toArray(function(err, records){
            if(err) return me.socket.emit('/artifacts',{success:false,message:err.message});

            return me.socket.emit('/artifacts',{success:true,artifact:records});
        });
    }
});
module.exports = Artifact;