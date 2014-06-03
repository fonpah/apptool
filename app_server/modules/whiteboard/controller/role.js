/**
 * Created by fonpah on 03.06.2014.
 */
var Class = require('class.extend');
var mongodb = require('mongodb' );
var Role = Class.extend({
    init: function(db,appSocket){
        this.db = db;
        this.socket = appSocket;
        this.collection = this.db.collection('roles');
    },
    readAction:function(req, res, next){
        var me = this;
        this.collection.findOne({_id:new mongodb.ObjectID(req.param('id'))},{},function(err, doc){
            if(err) return res.json({success:false, message:err.message});

            if(!doc)return res.json({success:false, message:'Role not found!'});
            var ids = doc.permissionIds || [];
            var idObjs =[];
            ids.forEach(function(val){
                idObjs.push(new mongodb.ObjectID(val));
            },me);
            me.db.collection('permissions' ).find({_id:{$in:idObjs}}).toArray(function(error,docs){
                if(!error){
                    doc.permissions= docs;
                }
                return res.json({success:true, role: doc});
            });

        });
    }
});
module.exports= Role;