/**
 * Created by fonpah on 25.05.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Comment = Class.extend({
    init: function(db,appSocket){
        var me = this;
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('comments');
        this.socket.on('/comment/create',function(data){me.createAction(data);});
        this.socket.on('/comment/update', function(data){me.updateAction(data);});
        this.socket.on('/comment/delete', function(data){me.deleteAction(data);});
        this.socket.on('/comments', function(data){me.listAction(data);});
    } ,
    updateAction:function(data){
        var me = this;
        var id = data._id;
        delete data._id;
        me.collection.findAndModify({_id:new mongodb.ObjectID(id)},[],{$set:data},{new:true},function(err, doc){
            if(err) return me.socket.emit('/comment/update',{success:false,message:err.message});
            me.socket.emit('/comment/update',{success:true,message:'ok'});
        });
    },
    deleteAction:function(data){
        var me = this;
        this.collection.findOne({_id:new mongodb.ObjectID(data._id)},function(err,doc){
            if(err) return me.socket.emit('/comment/delete',{success:false,message:err.message});
            var model= doc;
            me.collection.remove({_id:new mongodb.ObjectID(data._id)},function(err){
                if(err) return me.socket.emit('/comment/delete',{success:false,message:err.message});
                me.socket.emit('/comment/delete',{success:true,comment:data});
            });

        });
    },
    createAction:function(data){
        var me = this;
        this.collection.insert(data,function(err,records){
            if(err) return me.socket.emit('/comment/create',{success:false,message:err.message});
            me.socket.emit('/comment/create',{success:true,comment:records});
        });
    },
    removeListeners:function(){
        this.socket.removeAllListeners('/comment/create');
        this.socket.removeAllListeners('/comment/delete');
        this.socket.removeAllListeners('/comment/update');
        this.socket.removeAllListeners('/comments');

    },
    listAction:function(data){
        var me = this;
        var  id = data.artifactId;
        if(!id){
            return this.socket.emit('/comments',{success:false,message:'Invalid Id'});
        }
        this.collection.find({artifactId : id } ).toArray(function(err, records){
            if(err) return me.socket.emit('/comments',{success:false,message:err.message});

            return me.socket.emit('/comments',{success:true,comment:records});
        });
    }
});
module.exports = Comment;