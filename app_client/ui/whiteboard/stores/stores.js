/**
 * Created by fonpah on 18.05.2014.
 */
Ext.define('App.store.AbstractSore',{
    extend:'Ext.data.Store',
    autoSync: false,
    constructor:function(config){
        this.addEvents({
            added:true,
            updated:true,
            removed:true
        });
        this.callParent(arguments);
    },
    listeners: {
        exception: function(proxy, response, operation){
            Ext.MessageBox.show({
                title: 'REMOTE EXCEPTION',
                msg: operation.getError(),
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        }
    },
    findByInternalId:function(internalId){
        var result = this.findBy(function(record){
            return record.internalId === internalId;
        });
        return result;
    },
    findByData:function(data){
      var result= this.findBy(function(record){
          var res= false;
          Ext.Object.each(data, function(key,value){
              if(record.get(key) !== value){
                  res = false;
                  return false;
              }else{
                  res= true;
              }
          });
          return res;
      });
        return result;
    },
    findPhantomRecord: Ext.emptyFn
});

Ext.define('App.store.Users',{
    extend:'App.store.AbstractSore',
    model:'App.model.User',
    storeId:'users',
    constructor: function(cfg){
        Ext.data.StoreManager.add(this.storeId,this);
        this.callParent(arguments);
    }
});

Ext.define('App.store.Connections',{
    extend:'App.store.AbstractSore',
    model:'App.model.Connection',
    storeId: 'connections',
    constructor: function(cfg){
        Ext.data.StoreManager.add(this.storeId,this);
        this.callParent(arguments);
    },
    proxy:{
        type:'socket',
        storeId: 'connections',
        api:{
            create:'/connection/create',
            read:'/connections',
            update:'/connection/update',
            destroy:'/connection/delete'
        },
        reader:{
            type:'json',
            root:'connection'
        },
        writer:{
            type:'json',
            root:'connection',
            writeAllFields: false
        }
    },
    queryByArtifactId: function(id){
        return this.queryBy(function(record){
            return (record.get('source' ).node == id ||record.get('target' ).node == id);
        });
    },
    findPhantomRecord:function(record){
        return this.findBy(function(model){
            return  model.get('id')=== record.get('id');
        });
    }
});


Ext.define('App.store.Comments',{
    extend:'App.store.AbstractSore',
    model:'App.model.Comment',
    storeId: 'comments',
    autoLoad:false,
    constructor: function(cfg){
        Ext.data.StoreManager.add(this.storeId,this);
        this.callParent(arguments);
    },
    proxy:{
        type:'socket',
        storeId: 'comments',
        api:{
            create:'/comment/create',
            read:'/comments',
            update:'/comment/update',
            destroy:'/comment/delete'
        },
        reader:{
            type:'json',
            root:'comment'
        },
        writer:{
            writeAllFields: false,
            type:'json',
            root:'comment'
        }
    },
    findPhantomRecord:function(record){
        return this.findBy(function(model){
            var be4=Date.parse(model.get('createdAt'));
            var after =Date.parse(record.get('createdAt'));
            return  be4=== after;
        });
    }
});


Ext.define('App.store.Artifacts',{
    extend:'App.store.AbstractSore',
    model:'App.model.Artifact',
    constructor: function(cfg){
        Ext.data.StoreManager.add(this.storeId,this);
        this.callParent(arguments);
    },
    autoLoad:false,
    storeId: 'artifacts',
    proxy:{
        type:'socket',
        storeId: 'artifacts',
        api:{
            create:'/artifact/create',
            read:'/artifacts',
            update:'/artifact/update',
            destroy:'/artifact/delete'
        },
        reader:{
            type:'json',
            root:'artifact',
            idProperty:'_id'
        },
        writer:{
            writeAllFields: false,
            type:'json',
            root:'artifact'
        }
    },
    findPhantomRecord:function(record){
       return this.findBy(function(model){
           return  model.get('id')=== record.get('id');
        });
    }

});

Ext.define('App.store.Permissions',{
    extend:'App.store.AbstractSore',
    model:'App.model.Permission',
    storeId:'permissions',
    constructor: function(cfg){
        Ext.data.StoreManager.add(this.storeId,this);
        this.callParent(arguments);
    },
    proxy:{
        type:'ajax',
        storeId: 'permissions',
        api:{
            create:'/permission/create',
            read:'/permissions',
            update:'/permission/update',
            destroy:'/permission/delete'
        },
        reader:{
            type:'json',
            root:'permission'
        },
        writer:{
            type:'json',
            root:'permission',
            writeAllFields: false
        }
    }
});

/*Ext.define('App.store.Contents',{
    extend:'App.store.AbstractSore',
    model:'App.model.Content',
    storeId:'contents',
    constructor: function(cfg){
        Ext.data.StoreManager.add(this.storeId,this);
        this.callParent(arguments);
    },
    proxy:{
        type:'socket',
        storeId: 'contents',
        api:{
            create:'/content/create',
            read:'/contents',
            update:'/content/update',
            destroy:'/content/delete'
        },
        reader:{
            type:'json',
            root:'content'
        },
        writer:{
            type:'json',
            root:'content',
            writeAllFields: false
        }
    },
    findPhantomRecord:function(record){
        return this.findBy(function(model){
            var be4=Date.parse(model.get('createdAt'));
            var after =Date.parse(record.get('createdAt'));
            console.log(be4);
            console.log(after);
            return  be4=== after;
        });
    }
});*/

