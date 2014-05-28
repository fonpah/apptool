/**
 * Created by fonpah on 15.05.2014.
 */
Ext.define('App.controller.controller',{
    extend:'Ext.app.Controller',
    isAuthorized:function(model){
        var user= this.application.user;
        return user.get('_id')==model.get('userId');
    }
});
Ext.define('App.controller.board',{
    extend:'App.controller.controller',
    models: ['Artifact','Comment','Connection','Content','User','Activity'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    views:['Contextmenu'],
    menu: null,
    init: function(){
        this.menu = Ext.create(this.getContextmenuView());
        this.application.on('openwhiteboard',this.onOpenWhiteboard,this);
        this.on('drop',this.onDrop, this);
        this.on('createconnection',this.createConnection, this);
        this.on('contextmenu',this.onShowContextMenu,this);
        //this.application.on('loadstore',this.onLoadStores, this);
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
        this._addStoreListeners();
    },
    getTabConfig: function () {
        var me = this;
        return {
            xtype:'whiteboard',
            activity: this.application.activity
        };
    },
    onOpenWhiteboard: function(mainCmp, activity){
        var tabItem = mainCmp.add( this.getTabConfig() );
        tabItem.show();
        mainCmp.setActiveTab( tabItem );
        tabItem.fireEvent( 'tabactivate', tabItem );
        this.application.currentCanvas = tabItem.canvas;
        if(!activity){
            Ext.Error.raise('Activity could not be loaded');
        }
        this.onLoadStores(activity);
        return tabItem;
    },
    onDrop: function(canvas,droppedDomNode, x, y){
        var type =  $( droppedDomNode ).data( "shape" );
        this.addFigure(canvas, type, null, false, x, y );
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
        if(!figure){
            Ext.Error.raise('Figure in null');
            return;
        }
        if(item.itemId == 'enter_content_item'){
            this.getController('content' ).addContent(figure);
        }else if(item.itemId == 'comment_item'){
            this.getController('comment' ).viewComments(figure);
        }else if(item.itemId == 'view_content_item'){
            this.getController('content' ).viewContent(figure);
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
        this.getArtifactsStore().load({
            params:{activityId:activity.get('_id')},
            callback:function(){
                me.application.fireEvent('loadstore',activity);
            }
        });
    },
    /************************************ARTIFACT EVENTS***********************************************************/
    createFigure:function(canvas,type, title, isInAutoAddSection, x, y){
        var figure =  Ext.create( type );
        figure.activityId = this.application.activity.get('_id');
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
        var figure = this.createFigure( canvas, type, title, isInAutoAddSection, x, y );
        var activity = this.application.activity;
        var user = this.application.user;
        var config = $.extend(true,{activityId:activity.get('_id'),userId:user.get('_id')},figure.getPersistentAttributes());
        var store = this.getArtifactsStore();
        if(!store.findRecord('id',figure.id,0,false,true,true)){
            var model = Ext.create(this.getArtifactModel(),config);
            store.add(model);
            store.sync({
                callback:function(){
                    console.log(arguments);
                },
                success:function(){
                    console.log(arguments);
                },
                failure:function(){
                    console.log(arguments);
                },
                scope:this
            });
        }
        return figure;
    },

    deleteArtifact: function(canvas,figure){
        if(!figure){
            return false;
        }

        var store = this.getArtifactsStore();
        var connStore = this.getConnectionsStore();
        var model = store.findRecord('id',figure.id,0,false,true,true);
        if(!this.isAuthorized(model)){
            return false;
        }
        this.getController('property' ).fireEvent('deletepropertyform',model,canvas, figure);
        var me = this;
        var lines = connStore.queryByArtifactId(figure.id);
        this.bulkRemoveConnection(connStore,lines,canvas,function(){
            store.remove(model);
            store.sync({
                callback:function(){
                    console.log(arguments);
                },
                success:function(){
                    console.log(arguments);
                },
                failure:function(){
                    console.log(arguments);
                },
                scope:me
            });
            canvas.removeFigure(figure);
        });

    },
    onReadArtifacts:function(store,records,successfull,eOPts){
        var canvas = this.application.currentCanvas;
        var activity = this.application.activity;
        if(!successfull){
            return;
        }
        if(this._unmarshal(canvas, records)>0){
            this.getConnectionsStore().load({
                params:{activityId:activity.get('_id')}
            });
        }

    },
    onArtifactAdded: function(store,records,successfull){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
       this._unmarshal(canvas, records);
    },
    onArtifactRemoved: function(store,records,successfull){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
        this._removeFigures(canvas,records);
    },
    onArtifactUpdated: function(store,records,successfull){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
        this._updateFigures(canvas,records);
    },
    /************************************CONNECTION EVENTS***********************************************************/
    createConnection: function(conn,canvas){
        var activity = this.application.activity;
        var user = this.application.user;
        var config = $.extend(true,{activityId:activity.get('_id'),userId:user.get('_id')},conn.getPersistentAttributes());
        var store = this.getConnectionsStore();
        if(store.findRecord('id', $.trim(conn.id),0,false,true,true) === null){
            var model = Ext.create(this.getConnectionModel(),config);
            store.add(model);
            store.sync({
            callback:function(){
              console.log(arguments);
            },
            success:function(){
                console.log(arguments);
            },
            failure:function(){
                console.log(arguments);
            },
            scope:this
            });
        }
    },
    deleteConnection: function(canvas, conn,model){
        var store = this.getConnectionsStore();
        if(typeof conn ==='undefined'){
            return false;
        }
        if(typeof model ==='undefined'){
            model = store.findRecord('id', $.trim(conn.id));
        }
        if(!this.isAuthorized(model)){
            return false;
        }
        store.remove(model);
        store.sync({
            callback:function(){

            },
            success:function(){
                canvas.removeFigure(conn);
            },
            scope:this
        });

    },
    bulkRemoveConnection:function(store,lines,canvas,callback){
        var me = this;
        if(lines.getCount()>0){
            var arr=[];
            lines.each(function(line){
                canvas.removeFigure(canvas.getLine(line.get('id')));
                arr.push(line);
            },me);
            store.remove(arr);
            store.sync({
                callback:function(){
                   if(typeof callback=='function'){
                       callback();
                   }
                },
                scope:me
            });
        }
        else{
            if(typeof callback=='function'){
                callback();
            }
        }
    },
    onReadConnections:function(store,records,successfull,eOPts){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
        this._unmarshal(canvas, records,'line');
    },
    onConnectionAdded: function(store,records,successfull){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
        this._unmarshal(canvas, records);
    },
    onConnectionUpdated:function(store,records,successfull){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
        this._updateFigures(canvas,records,'line');
    },
    onConnectionRemoved: function(store,records,successfull){
        var canvas = this.application.currentCanvas;
        if(!successfull){
            return;
        }
        this._removeFigures(canvas,records,'line');
    },
    /************************************PRIVATE METHODS***********************************************************/
    _unmarshal:function(canvas,records,type){
        var figures=[];
        Ext.Object.each( records, function ( key, model ) {
            var figure = (type=='line'?canvas.getLine(model.get('id')):canvas.getFigure(model.get('id')));
            if(!figure){
                figures.push(model.getData());
            }
        } );
        canvas.ioReader.unmarshal(canvas,figures);
        return figures.length;
    },
    _updateFigures: function(canvas,records,type){
        var affected=0;
        var me = this;
        Ext.Object.each(records,function(key, model){
            var figure =(type=='line'?canvas.getLine(model.get('id')):canvas.getFigure(model.get('id')));
            if(figure){
                figure.setPersistentAttributes(model.getData());
                figure.repaint();
                affected++;
            }
        });
        return affected;
    },
    _removeFigures: function(canvas,records,type){
        var affected=0;
        Ext.Object.each(records,function(key, model){
            var figure =(type=='line'?canvas.getLine(model.get('id')):canvas.getFigure(model.get('id')));
            if(figure){
                canvas.removeFigure(figure);
                affected++;
            }
        });
        return affected;
    },
    _addStoreListeners:function(){
        this.getArtifactsStore().addListener('added',this.onArtifactAdded,this);
        this.getArtifactsStore().addListener('updated',this.onArtifactUpdated,this);
        this.getArtifactsStore().addListener('removed',this.onArtifactRemoved,this);

        this.getArtifactsStore().addListener('read',this.onReadArtifacts,this);
        this.getConnectionsStore().addListener('read',this.onReadConnections, this);

        this.getConnectionsStore().addListener('added',this.onConnectionAdded,this);
        this.getConnectionsStore().addListener('updated',this.onConnectionUpdated,this);
        this.getConnectionsStore().addListener('removed',this.onConnectionRemoved,this);
    }


});


Ext.define('App.controller.content',{
    extend:'App.controller.controller',
    models: ['Artifact','Comment','Content'],
    stores: ['Artifacts', 'Connections', 'Comments'/*, 'Contents'*/],
    init:function(){
        this.addEvents({
            'dblclick':true
        });
        this.control({
            'window[itemId="content-editor"] button[action="save-content"]':{
                    click:{
                        fn:this.onSaveContent,
                        scope:this
                    }
            },
            'window[itemId="content-editor"] button[action="cancel-content"]':{
                click:{
                    fn:this.onCancel,
                    scope:this
                }
            },
            'htmleditor':{
                change:{
                    fn:this.onContentChange,
                    scope:this
                }
            },
            'window[itemId="content-editor"]':{
                beforeshow:{
                    fn:this.onBeforeShowContentEditor,
                    scope:this
                }
            }
        });
        this.on('dblclick',this.viewContent,this);
    },
    viewContent: function(figure){
        var me= this;
        this._getArtifactAndContent(figure, function(artifact,content){
            me._openContentWindow(artifact,content);
        });
    },
    addContent: function(figure){
        var me = this;
        if(!figure){
            return false;
        }
        me._getArtifactAndContent(figure,function(artifact,content){
            if(!me.isAuthorized(artifact)){
                return false;
            }
            me._openContentEditor(artifact,content);
        });
    },
    onSaveContent: function ( btn ) {
        var util = this.application.util;
        if ( !btn.up( 'form' ).getForm().isValid() ) {
            return false;
        }
        var data = btn.up( 'form' ).down( 'htmleditor[name="data"]' );
        var win = btn.up( 'window' );
        var mask = win.setLoading('saving ...');
        var artifact = win.artifact;
        var content = win.contentModel;
        var user = this.application.user;

        if ( Ext.isEmpty( content.get( '_id' ) ) ) {
            content.set( 'userId', user.get( '_id' ) );
            content.set( 'artifactId', artifact.get( '_id' ) );
            content.set( 'activityId', artifact.get( 'activityId' ) );
        }

        content.save({
            callback : function(record, operation) {
                if (operation.success) {
                    util.showSuccessMsg('Content successfully saved!');
                } else {
                    // failure
                }
                mask.hide();
            }
        });


    },
    onCancel:function(btn){
        btn.up( 'window' ).close();
    },
    onContentChange:function(cmp){
        cmp.up( 'window' ).contentModel.set('data',cmp.getValue());
        //console.log(cmp.up( 'window' ).contentModel.get('data'));
    },
    onBeforeShowContentEditor:function(cmp){
        cmp.setTitle(App.current.util.shortenString(cmp.artifact.get('title'),11));
    },
    _getArtifactAndContent: function(figure,callback){
        var artifactStore = this.getArtifactsStore(),
            artifact= artifactStore.findRecord('id',figure.id);
        if(!artifact) {
            Ext.Error.raise( 'Artifact not found!' );
            return false;
        }
        var me = this;
        this.getContentModel().load(null,{
            success:function(record, operation){
                if(!record){
                    record = Ext.create(me.getContentModel());
                }
                if(typeof callback ==='function'){
                    callback(artifact,record);
                }
            },
            params:{
                artifactId:artifact.get('_id')
            }
        })

    },
    _openContentWindow:function(artifact, content){
        var util = this.application.util;
        var win = Ext.createWidget('contentwindow',{
            title: util.shortenString( artifact.get( 'title' ), 12 ),
            html : content.get('data') || 'No content Available'
        });
        win.show();
    },
    _openContentEditor:function(artifact,content){
        var me = this;
        return Ext.widget('window', {
            title: App.current.util.shortenString(artifact.get('title'),11),
            closeAction: 'destroy',
            minWidth: 400,
            minHeight: 400,
            closable:true,
            autoScroll: true,
            layout: 'fit',
            itemId:'content-editor',
            resizable: true,
            modal: true,
            artifact:artifact,
            contentModel:content,
            items: me._buildForm(content)
        } ).show();

    },
    _buildForm: function (content) {
        return Ext.widget( 'form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'top',
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },
            items: [
                {
                    xtype: 'htmleditor',
                    name: 'data',
                    height: 300,
                    allowBlank: false,
                    value:content.get('data')
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    action:'save-content'

                },
                {
                    text: 'Cancel',
                    action:'cancel-content'
                }
            ]
        } );
    }

});

Ext.define('App.controller.comment',{
    extend:'App.controller.controller',
    models: ['Artifact','Comment','Content'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    init:function(){
        this.control({
            'commentsview':{
                afterrender:this.onAfterRenderView,
                scope:this
            },
            'commentswindow button[action="send-comment"]':{
                click:this.addComment,
                scope:this
            },
            'commentswindow li.list-row':{
                contextmenu:{
                    fn:function(){
                        console.log('sdfsdf');
                        return false;
                    },
                    scope:this
                }
            }
        });
    },
    onAfterRenderView:function(cmp){
        var artifact= cmp.up('commentswindow').artifact;
        var store =cmp.getStore();
        store.load({
            params:{
                artifactId:artifact.get('_id')
            }
        });
    },
    viewComments: function(figure){
        var artifact = this.getArtifactsStore().findRecord('id',figure.id);
        return Ext.createWidget('commentswindow',{
           title: App.current.util.shortenString(artifact.get('title'),11),
           artifact: artifact,
           items:[
               {
                    xtype:'commentspanel',
                   items:Ext.widget('commentsview',{
                       store: this.getCommentsStore()
                   })
               }
           ]
        } ).show();
    },
    addComment: function ( cmp ) {
        var win = cmp.up( 'commentswindow' );
        var artifact = win.artifact;
        var user = this.application.user;
        var dataview = win.down( 'commentsview' );
        var text = win.down( 'textareafield' );
        if ( !$.trim( text.getValue() ) ) {
            return false;
        }
        var mask = win.setLoading( 'saving ...' );
        var model = Ext.create( this.getCommentModel(), {
            text: text.getValue(),
            userId: user.get( 'id' ),
            activityId: artifact.get( 'activityId' ),
            artifactId: artifact.get( '_id' )

        } );
        var store = dataview.getStore();
        store.add( model );
        store.sync( {
            callback: function () {
                mask.hide();
            },
            success: function () {
                text.setValue( '' );
            }
        } )

    }
});






Ext.define('App.controller.property',{
    extend:'App.controller.controller',
    models: ['Artifact','Comment'],
    stores: ['Artifacts', 'Connections', 'Comments', 'Contents'],
    init: function(){
        this.on('createpropertyform',this.createPropertyForm,this);
        this.on('deletepropertyform',this.onDeletePropertyForm,this);
        this.on('collapsepropertyform',this.onCollapsePropertyForm,this);
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
            form.getForm().setValues(model.getData());
        }else{
            form = form[0];
            form.getForm().setValues(model.getData());
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
        var store= this.getArtifactsStore();
        var title = $.trim( cmp.getValue() );
        if ( title.length !== 0 ) {
            cmp.up( 'form' ).figure.updateTitle( title, true );
            cmp.up( 'form' ).setTitle( App.current.util.shortenString( title, 11 ) );
            var form = cmp.up('form' ).form;
            var model = store.findRecord('id',cmp.up('form' ).figure.id,0,false,true,true);
            model.set(cmp.getName(),cmp.getValue());
            store.sync();
        }
    },
    onChangeDescription: function ( cmp ) {
        var me = this;
        var store= this.getArtifactsStore();
        var description = $.trim( cmp.getValue() );
        if ( description.length !== 0 ) {
            cmp.up('form' ).figure.decsription = description;
            var form = cmp.up('form' ).form;
            var model = store.findRecord('id',cmp.up('form' ).figure.id,0,false,true,true);
            model.set(cmp.getName(),cmp.getValue());
            store.sync();

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

    }

});



Ext.define('App.controller.controls',{
    extend:'App.controller.controller',
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

