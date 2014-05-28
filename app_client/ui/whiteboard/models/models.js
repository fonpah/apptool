/**
 * Created by fonpah on 18.05.2014.
 */



Ext.define('App.model.User',{
    extend:'Ext.data.Model',
    idProperty: '_id',
    fields:[
        {name:'_id',type:'string'},
        {name:'firstName',type:'string'},
        {name:'lastName',type:'string'},
        {name:'role',type:'string'}
    ],
    proxy: {
        type: 'ajax',
        url: '/user/read',
        reader: {
            type: 'json',
            root: 'user'
        },
        writer: {
            type: 'json'
        }
    }
});


Ext.define('App.model.Activity',{
    extend:'Ext.data.Model',
    idProperty: '_id',
    fields:[
        {name:'_id',type:'string'},
        {name:'title',type:'string'},
        {name:'description',type:'string'},
        {name:'type',type:'string'},
        'nodePool'
    ],
    proxy: {
        type: 'ajax',
        url: '/activity/read',
        reader: {
            type: 'json',
            root: 'activity'
        },
        writer: {
            type: 'json'
        }
    }
});

Ext.define('App.model.Artifact',{
    extend:'Ext.data.Model',
    idProperty: '_id',
    clientIdProperty:'clientId',
    fields:[
        {name:'_id',type:'string'},
        {name:'id',type:'string'},
        {name:'title',type:'string'},
        {name:'description',type:'string'},
        {name:'type',type:'string'},
        {name:'x',type:'float'},
        {name:'y',type:'float'},
        {name:'width',type:'int'},
        {name:'height',type:'int'},
        {name:'userId',type:'string'},
        {name:'activityId',type:'string'},
        {name:'createdAt',type:'datetime',defaultValue:new Date().toJSON()}
    ],
    proxy: {
        type: 'socket',
        api: {
            create:'/artifact/create',
            read:'/artifact/read',
            update:'/artifact/update',
            destroy:'/artifact/delete'
        },
        reader: {
            type: 'json',
            root: 'artifact'
        },
        writer: {
            type: 'json',
            root:'artifact'
        }
    }
});

Ext.define('App.model.Connection',{
    extend:'Ext.data.Model',
    idProperty: '_id',
    fields:[
        {name:'_id',type:'string'},
        {name:'userId',type:'string'},
        {name:'activityId',type:'string'},
        {name:'id',type:'string'},
        {name:'type',type:'string'},
        {name:'stroke',type:'int'},
        {name:'color',type:'string'},
        {name:'policy',type:'string'},
        {name:'router',type:'string'},
        'source',
        'target',
        {name:'createdAt',type:'datetime',defaultValue:new Date().toJSON()}
    ],
    proxy: {
        type: 'socket',
        api: {
            create:'/connection/create',
            read:'/connection/read',
            update:'/connection/update',
            destroy:'/connection/delete'
        },
        reader: {
            type: 'json',
            root: 'connection'
        },
        writer: {
            type: 'json',
            root:'connection'
        }
    }
});

Ext.define('App.model.Comment',{
    extend:'Ext.data.Model',
    idProperty: '_id',
    fields:[
        {name:'_id',type:'string'},
        {name:'userId',type:'string'},
        {name:'activityId',type:'string'},
        {name:'artifactId',type:'string'},
        {name:'text',type:'string'},
        {name:'createdAt',type:'datetime',defaultValue:new Date().toJSON()}
    ],
    proxy: {
        type: 'socket',
        api: {
            create:'/comment/create',
            read:'/comment/read',
            update:'/comment/update',
            destroy:'/comment/delete'
        },
        reader: {
            type: 'json',
            root: 'comment'
        },
        writer: {
            type: 'json',
            root:'comment'
        }
    }
});


Ext.define('App.model.Content',{
    extend:'Ext.data.Model',
    idProperty: '_id',
    fields:[
        {name:'_id',type:'string'},
        {name:'userId',type:'string'},
        {name:'activityId',type:'string'},
        {name:'type',type:'string',defaultValue:'text'},
        {name:'artifactId',type:'string'},
        'data',
        {name:'createdAt',type:'datetime',defaultValue:new Date().toJSON()}
    ],
    proxy: {
        type: 'ajax',
        api: {
            create:'/content/create',
            read:'/content/read',
            update:'/content/update',
            destroy:'/content/delete'
        },
        reader: {
            type: 'json',
            root: 'content'
        },
        writer: {
            type: 'json',
            root:'content',
            writeAllFields: false
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'POST'
        }
    }
});