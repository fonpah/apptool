/**
 * Created by fonpah on 18.05.2014.
 */
Ext.define('App.store.AbstractSore',{
    extend:'Ext.data.Store',
    autoSync: false,
    addModel: function(model){
        var me = this;
        this.suspendAutoSync();
        model.save({
            success:function(newModel, req){
                if(req.success){
                    me.add(newModel);
                }
                me.resumeAutoSync();
            }
        });
    }
});

Ext.define('App.store.Users',{
    extend:'App.store.AbstractSore',
    model:'App.model.User'
});

Ext.define('App.store.Connections',{
    extend:'App.store.AbstractSore',
    model:'App.model.Connection',
    proxy:{
        type:'ajax',
        api:{
            create:'/connection/create',
            read:'/connections',
            update:'/connection/update',
            destroy:'/connection/delete'
        },
        reader:{
            type:'json',
            root:'connections'
        },
        writer:{
            type:'json',
            root:'connection',
            writeAllFields: false
        }
    }
});


Ext.define('App.store.Comments',{
    extend:'App.store.AbstractSore',
    model:'App.model.Comment',
    proxy:{
        type:'ajax',
        api:{
            create:'/comment/create',
            read:'/comments',
            update:'/comment/update',
            destroy:'/comment/delete'
        },
        reader:{
            type:'json',
            root:'comments'
        },
        writer:{
            writeAllFields: false,
            type:'json',
            root:'comment'
        }
    }
});


Ext.define('App.store.Artifacts',{
    extend:'App.store.AbstractSore',
    model:'App.model.Artifact',
    autoLoad:false,
    autoSync: false,
    proxy:{
        type:'ajax',
        api:{
            //create:'/artifact/create',
            read:'/artifacts'//,
            //update:'/artifact/update',
            //destroy:'/artifact/delete'
        },
        reader:{
            type:'json',
            root:'artifacts',
            async:true
        }/*,
        writer:{
            writeAllFields: false,
            type:'json',
            root:'artifact',
            async:true
        }*/
    }

});

Ext.define('App.store.Contents',{
    extend:'App.store.AbstractSore',
    model:'App.model.Content'
});