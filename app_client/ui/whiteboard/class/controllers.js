/**
 * Created by fonpah on 15.05.2014.
 */
Ext.define('App.controller.board',{
    extend:'Ext.app.Controller',
    models: ['Artifact','Comment','Connection','Content','User','Activity'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    views:['Contextmenu'],
    menu: null,
    init: function(){
        this.menu = Ext.create(this.getContextmenuView());
        this.application.on('openwhiteboard',Ext.bind(this.onOpenWhiteboard,this));
        this.on('drop',Ext.bind(this.onDrop, this));
        this.on('createconnection',Ext.bind(this.onCreateConnection, this));
        this.on('contextmenu',Ext.bind(this.onShowContextMenu,this));
        this.on('dblclick',Ext.bind(this.onOpenContentWindow,this));
        this.application.on('loadstore',Ext.bind(this.onLoadStores, this));
        this.control({
            'contextmenu > menuitem':{
                click:this.onClickMenuitem,
                scope:this
            },
            'whiteboard':{
                activate:function(){
                    console.log(arguments);
                }
            }
        });
    },
    getTabConfig: function () {
        var me = this;
        return {
            xtype:'whiteboard',
            activity: this.application.activity
        };
    },
    onOpenWhiteboard: function(mainCmp){
        var tabItem = mainCmp.add( this.getTabConfig() );
        tabItem.show();
        mainCmp.setActiveTab( tabItem );
        tabItem.fireEvent( 'tabactivate', tabItem );
        this.application.currentCanvas = tabItem.canvas;
        return tabItem;
    },
    onDrop: function(canvas,droppedDomNode, x, y){
        var type =  $( droppedDomNode ).data( "shape" );
        this.addFigure(canvas, type, null, false, x, y );
    },
    createFigure:function(canvas,type, title, isInAutoAddSection, x, y){
        var figure =  Ext.create( type );
        figure.activityId = this.application.activity.get('id');
        if ( title ) {
            figure.updateTitle( title, true );
        }
        if ( isInAutoAddSection ) {
            figure.isInAutoAddSection = true;
        }
        canvas.addFigure( figure, x - 25, y - 25 );

        return figure;
    },
    addFigure: function(canvas,  type, title, isInAutoAddSection, x, y ){
        var figure;
        figure = this.createFigure( canvas, type, title, isInAutoAddSection, x, y );
        this.createArtifact(figure,canvas);
        return figure;
    },
    createArtifact: function(figure,canvas){
        var activity = this.application.activity;
        var user = this.application.user;
        var config = $.extend(true,{activityId:activity.get('id'),userId:user.get('id')},figure.getPersistentAttributes());
        var store = this.getArtifactsStore();
        if(!store.findRecord('id',figure.id,0,false,true,true)){
           this.getController('socketio' ).doCreate('client/artifact/create',config);
        }

    },
    onCreateConnection: function(conn,canvas){
        var activity = this.application.activity;
        var user = this.application.user;
        var config = $.extend(true,{activityId:activity.get('id'),userId:user.get('id')},conn.getPersistentAttributes());
        var store = this.getConnectionsStore();
        if(!store.findRecord('id',conn.id,0,false,true,true)){
            this.getController('socketio' ).doCreate('client/connection/create',config);
        }
    },
    deleteArtifact: function(canvas,figure){
        if(!figure){
            return false;
        }
        var store = this.getArtifactsStore();
        var connStore = this.getConnectionsStore();
        var model = store.findRecord('id',figure.id,0,false,true,true);
        this.getController('property' ).fireEvent('deletepropertyform',model,canvas, figure);
        var me = this;
        connStore.each(function(conn){
            if(conn.get('source' ).node == figure.id ||conn.get('target' ).node == figure.id){
                me.deleteConnection(canvas,canvas.getLine(conn.get('id')), conn);
            }
        });
        this.getController('socketio' ).doDelete('client/artifact/delete',model);
        store.remove(model);
        canvas.removeFigure(figure);
    },
    deleteConnection: function(canvas, conn,model){
        if(!conn){
            return false;
        }
        if(!model){
            var connStore = this.getConnectionsStore();
            model = connStore.findRecord('id',conn.id);
        }
        this.getController('socketio' ).doDelete('client/connection/delete',model);
        canvas.removeFigure(conn);
    },
    onShowContextMenu: function(canvas, event){
        var figure = canvas.currentTarget;
        var items =[];
        this.menu.removeAll();
        if(figure instanceof draw2d.SetFigure){
            items=[
                {
                    text: 'Enter Content',
                    glyph:'xf067@fa',
                    itemId:'enter_content_item'
                },
                {
                    text: 'View Comment',
                    glyph:'xf075@fa',
                    itemId:'comment_item'
                },
                {
                    text: 'View Content',
                    glyph:'xf06e@fa',
                    itemId:'view_content_item'
                },
                {
                    text: 'Delete',
                    glyph:'xf014@fa',
                    itemId:'delete_node_item'
                }
            ];

        }
        else if(figure instanceof draw2d.Connection){
            items =[
                {
                    text: 'Delete',
                    glyph:'xf014@fa',
                    itemId:'delete_line_item'
                }
            ];
        }
        if(items.length>0){
            this.menu.add(items);
            this.menu.showAt(event.getXY());
        }

    },
    onClickMenuitem:function(item){
        var canvas = this.application.currentCanvas;
        var figure = canvas.currentTarget;
        if(item.itemId == 'enter_content_item'){
            this.onOpenContentWindow(canvas, figure);
        }else if(item.itemId == 'comment_item'){

        }else if(item.itemId == 'view_content_item'){
            this.onOpenContentWindow(canvas, figure);
        }else if(item.itemId == 'delete_node_item'){
            this.deleteArtifact(canvas, figure);
        }else if(item.itemId == 'delete_line_item'){
            this.deleteConnection(canvas, figure);
        }
    },
    onOpenContentWindow: function(canvas, figure){
        console.log(arguments);
    },
    onLoadStores: function(activity){
        var me = this;
        var canvas = this.application.currentCanvas;
        this.getArtifactsStore().load({
            params:{id:activity.get('id')},
            callback: function(records){
                Ext.Object.each( records, function ( key, model ) {
                    canvas.ioReader.unmarshal(canvas,[model.getData()]);
                } );
                me.getConnectionsStore().load({
                    params:{id:activity.get('id')},
                    callback: function(records){
                        Ext.Object.each( records, function ( key, model ) {
                            canvas.ioReader.unmarshal(canvas,[model.getData()]);
                        } );
                    }
                });
            }
        });

    }

});



Ext.define('App.controller.controls',{
    extend:'Ext.app.Controller',
    models: ['Artifact','Comment'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    views:['CommandToolbar'],
    refs:[
        {
            ref:'zoomout',
            selector:'commandtoolbar button[action="zoom-out"]'
        },
        {
            ref:'zoomin',
            selector:'commandtoolbar button[action="zoom-in"]'
        },
        {
            ref:'reset',
            selector:'commandtoolbar button[action="reset"]'
        },
        {
            ref:'undo',
            selector:'commandtoolbar button[action="undo"]'
        },
        {
            ref:'redo',
            selector:'commandtoolbar button[action="redo"]'
        }
    ],
    init: function(){
        this.application.topToolBarCmp.add({xtype:'commandtoolbar'});
        this.on('stackchanged',Ext.bind(this.onStackChanged, this));
        this.control({
            'commandtoolbar button[action="zoom-out"]':{
                click:{
                    fn:this.onZoomOut,
                    scope: this
                }
            },
            'commandtoolbar button[action="zoom-in"]':{
                click:{
                    fn:this.onZoomIn,
                    scope: this
                }
            },
            'commandtoolbar button[action="reset"]':{
                click:{
                    fn:this.onReset,
                    scope: this
                }
            },
            'commandtoolbar button[action="undo"]':{
                click:{
                    fn:this.onUndo,
                    scope: this
                }
            },
            'commandtoolbar button[action="redo"]':{
                click:{
                    fn:this.onRedo,
                    scope: this
                }
            }
        });
    },
    onStackChanged:function(canvas, event){
        var canUndo = event.getStack().canUndo();
        var canRedo = event.getStack().canRedo();
        this.getUndo().setDisabled( !canUndo );
        this.getRedo().setDisabled( !canRedo );
    },
    onZoomIn: function(){
        var canvas = this.application.currentCanvas;
        if(!canvas){
            return false;
        }
        canvas.setZoom( canvas.getZoom() - 0.1, true );
    },
    onZoomOut:function(){
        var canvas = this.application.currentCanvas;
        if(!canvas){
            return false;
        }
        canvas.setZoom(canvas.getZoom() + 0.1, true );
    },
    onReset:function(){
        var canvas = this.application.currentCanvas;
        if(!canvas){
            return false;
        }
        canvas.setZoom( 1.0, true );
    },
    onUndo:function(){
        var canvas = this.application.currentCanvas;
        if(!canvas){
            return false;
        }
        canvas.getCommandStack().undo();
    },
    onRedo: function(){
        var canvas = this.application.currentCanvas;
        if(!canvas){
            return false;
        }
        canvas.getCommandStack().redo();
    }
});







Ext.define('App.controller.property',{
    extend:'Ext.app.Controller',
    models: ['Artifact','Comment'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    init: function(){
        this.on('createpropertyform',Ext.bind(this.createPropertyForm,this));
        this.on('deletepropertyform',Ext.bind(this.onDeletePropertyForm,this));
        this.on('collapsepropertyform',Ext.bind(this.onCollapsePropertyForm,this));
    },
    createPropertyForm: function(figure, canvas){
        if(!figure){
            this.onCollapsePropertyForm(canvas);
            return;
        }
        var store = this.getArtifactsStore();
        var model = store.findRecord('id',figure.id,0,false,true,true);
        if(!model){
            throw 'Model missing';
            return;
        }
        var form = Ext.ComponentQuery.query('form[itemId="'+figure.id+'"]');
        if(form.length<1){
            var propform = $.extend(true,{},this.application.propertyForm);
             form = this.application.propertyFormBuilder.buildForm({
                    fields: propform.fields,
                    buttons: propform.buttons,
                    itemId: model.get('id'),
                    title: App.current.util.shortenString( model.get('title'), 11 ),
                    figure: figure,
                    controller: this
                });
            form.loadRecord(model);
        }else{
            form = form[0];
        }
        this.updatePropertyFormPanel(form);

    },
    onDeletePropertyForm: function(model,canvas,figure){
        var id = figure.id;
        var form = Ext.ComponentQuery.query('form[itemId="'+id+'"]');
        if(form.length>0){
            form[0].destroy();
        }
    },
    onCollapsePropertyForm:function(canvas){
        this.application.eastPanelCmp.collapse();
    },
    onChangeTitle: function ( cmp ) {
        var me = this;
        var title = $.trim( cmp.getValue() );
        if ( title.length !== 0 ) {
            cmp.up( 'form' ).figure.updateTitle( title, true );
            cmp.up( 'form' ).setTitle( App.current.util.shortenString( title, 11 ) );
            var form = cmp.up('form' ).form;
            this.updateRecord(form);
        }
    },
    onChangeDescription: function ( cmp ) {
        var me = this;
        var description = $.trim( cmp.getValue() );
        if ( description.length !== 0 ) {
            cmp.up('form' ).figure.decsription = description;
            var form = cmp.up('form' ).form;
            this.updateRecord(form);
        }
    },
    updatePropertyFormPanel: function ( form ) {
        var app = this.application;
        if ( !form ) {
            return;
        }
        if ( !Ext.get( form.getId() ) ) {
            app.eastPanelCmp.add( form );
        }
        app.eastPanelCmp.setActiveTab( form );
        if(app.eastPanelCmp.getCollapsed()){
            app.eastPanelCmp.expand();
        }

    },
    updateRecord: function(form){
        var model = form.getRecord();
        form.updateRecord(model);
        this.getController('socketio' ).doUpdate('client/artifact/update',model);
    }

});

Ext.define('App.controller.socketio',{
    extend:'Ext.app.Controller',
    models: ['Artifact','Comment','Connection'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    init: function(){
        this.fullPath = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        this.establishRealTimeCom();
    },
    establishRealTimeCom: function () {
        var me = this;
        this.socket = io.connect(this.fullPath);
        this.socket.on('connected', function (data) {
            me.removeListeners();
            me.socket.on('server/artifact/updated',Ext.bind(me.onArtifactUpdated,me));
            me.socket.on('server/artifact/update/feedback',Ext.bind(me.onArtifactUpdateFeedback,me));
            me.socket.on('server/artifact/created',Ext.bind(me.onArtifactCreated,me));
            me.socket.on('server/artifact/create/feedback',Ext.bind(me.onArtifactCreateFeedback,me));
            me.socket.on('server/artifact/deleted',Ext.bind(me.onArtifactDeleted,me));
            me.socket.on('server/artifact/delete/feedback',Ext.bind(me.onArtifactDeleteFeedback,me));

            me.socket.on('server/connection/updated',Ext.bind(me.onConnectionUpdated,me));
            me.socket.on('server/connection/update/feedback',Ext.bind(me.onConnectionUpdateFeedback,me));
            me.socket.on('server/connection/created',Ext.bind(me.onConnectionCreated,me));
            me.socket.on('server/connection/create/feedback',Ext.bind(me.onConnectionCreateFeedback,me));
            me.socket.on('server/connection/deleted',Ext.bind(me.onConnectionDeleted,me));
            me.socket.on('server/connection/delete/feedback',Ext.bind(me.onConnectionDeleteFeedback,me));
        });

    },
    doCreate: function(path,data){
        var socket  = this.socket;
        socket.emit(path,data);
    },
    doDelete: function(path,model){
        var socket  = this.socket;
        socket.emit(path,{_id:model.get('_id'),userId:model.get('userId'),activityId:model.get('activityId')});
    },
    doUpdate:function(path,model){
        var socket  = this.socket;
        var modified = $.extend(true,{_id:model.get('_id'),userId:model.get('userId'),activityId:model.get('activityId')},model.getChanges());
        socket.emit(path,modified);
    },
    onArtifactUpdated: function(res){
        var store = this.getArtifactsStore();
        var data = res.artifact;
        var canvas = this.application.currentCanvas;
        if(res.success){
            this.afterUpdated(store, canvas, data);
        }
    },
    onArtifactUpdateFeedback:function(res){
        var store = this.getArtifactsStore();
        var data = res.artifact;
        if(res.success){
            var model = store.getById(data._id);
            if(model){
                model.modified ={};
            }
        }
    },
    onArtifactCreateFeedback:function(res){
        var store = this.getArtifactsStore();
        var data = res.artifact;
        if(res.success){
            var model = store.getById(data._id);
            if(!model){
                model = Ext.create(this.getArtifactModel(),data);
                store.add(model);
            }
        }
    },
    onArtifactCreated: function(res){
        var store = this.getArtifactsStore();
        var data = res.artifact;
        var canvas = this.application.currentCanvas;
        if(res.success){
            this.afterCreated(store, canvas, data, this.getArtifactModel())
        }
    },
    onArtifactDeleteFeedback:function(res){
        if(res.success){

        }
    },
    onArtifactDeleted: function(res){
        var store = this.getArtifactsStore();
        var data = res.artifact;
        var canvas = this.application.currentCanvas;
        if(res.success){
            var model = store.getById(data._id);
            if(model){
                var figure = canvas.getFigure(model.get('id'));
                if(figure){
                    canvas.removeFigure(figure);
                }
                store.remove(model);
            }
        }
    },
    onConnectionUpdated: function(res){
        var store = this.getConnectionsStore();
        var data = res.connection;
        var canvas = this.application.currentCanvas;
        if(res.success){
            this.afterUpdated(store, canvas, data)
        }
    },
    onConnectionUpdateFeedback:function(res){
        var store = this.getConnectionsStore();
        var data = res.connection;
        if(res.success){
            var model = store.getById(data._id);
            if(model){
                model.modified ={};
            }
        }
    },
    onConnectionCreateFeedback:function(res){
        var store = this.getConnectionsStore();
        var data = res.connection;
        if(res.success){
            var model = store.getById(data._id);
            if(!model){
                model = Ext.create(this.getConnectionModel(),data);
                store.add(model);
            }
        }
    },
    onConnectionCreated: function(res){
        var store = this.getConnectionsStore();
        var data = res.connection;
        var canvas = this.application.currentCanvas;
        if(res.success){
            this.afterCreated(store, canvas, data, this.getConnectionModel());
        }
    },
    onConnectionDeleteFeedback:function(res){
        if(res.success){

        }
    },
    onConnectionDeleted: function(res){
        var store = this.getConnectionsStore();
        var data = res.connection;
        var canvas = this.application.currentCanvas;
        if(res.success){
            this.afterDeleted(store, canvas, data,'connection');
        }
    },
    afterCreated:function(store, canvas, data,modelClass){
        var model = store.getById(data._id);
        if(!model){
            model = Ext.create(modelClass,data);
            store.add(model);
            var figure = canvas.getFigure(model.get('id'));
            if(!figure){
                canvas.ioReader.unmarshal(canvas,[model.getData()]);
            }
        }
    },
    afterUpdated: function(store, canvas, data){
        var model = store.getById(data._id);
        if(model){
            model.beginEdit();
            Ext.Object.each( data, function ( key, value) {
                if(key!='_id'){ model.set(key,value);}
            } );
            model.endEdit();
            var figure = canvas.getFigure(model.get('id'));
            if(figure){
                figure.setPersistentAttributes(model.getData());
                figure.repaint();
            }
            model.modified={};
        }
    },
    afterDeleted: function(store, canvas, data,type){
        var model = store.getById(data._id);
        if(model){
            if(type=='connection'){
                var figure=  canvas.getLine(model.get('id'));
            }
            else{
                var figure = canvas.getFigure(model.get('id'));
            }

            if(figure){
                canvas.removeFigure(figure);
            }
            store.remove(model);
        }
    },
    removeListeners:function(){
        this.socket.removeAllListeners('server/artifact/update/feedback');
        this.socket.removeAllListeners('server/artifact/create/feedback');
        this.socket.removeAllListeners('server/artifact/delete/feedback');
        this.socket.removeAllListeners('server/artifact/created');
        this.socket.removeAllListeners('server/artifact/deleted');
        this.socket.removeAllListeners('server/artifact/updated');

        this.socket.removeAllListeners('server/connection/update/feedback');
        this.socket.removeAllListeners('server/connection/create/feedback');
        this.socket.removeAllListeners('server/connection/delete/feedback');
        this.socket.removeAllListeners('server/connection/created');
        this.socket.removeAllListeners('server/connection/deleted');
        this.socket.removeAllListeners('server/connection/updated');
    }
});