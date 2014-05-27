/**
 * Created by fonpah on 02.05.2014.
 */
var app = null;
Ext.define( 'App.Application', {
    name: 'App',
    extend: 'Ext.app.Application',
    appFolder: '/ui/whiteboard',
    postfixNr: 0,
    appProperty: 'current',
    models: ['User','Activity','Connection','Artifact','Content','Comment'],
    stores: ['Artifacts', 'Connections', 'Comments'/*, 'Contents'*/],
    controllers:['board','property','controls','content','comment'],
    currentCanvas: null,
    activity:null,
    user:null,
    init: function () {
        this.addEvents('loadstore');
        this.defaultRouter = new draw2d.layout.connection.SplineConnectionRouter();
        this.fullPath = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        this.establishRealTimeCom();
        this.util = Ext.create( 'App.util.Util' );
        this.ajax = Ext.create( 'App.util.Ajax' );
        this.initMainContentCmp();
        this.initNorthPanelCmp();
        this.initSouthPanelCmp();
        this.initEastPanelCmp();
        this.initPropertyForm();
        this.propertyFormBuilder = Ext.create( 'App.builder.PropertyFormBuilder' );
        this.contentFormBuilder = Ext.create( 'App.builder.ContentFormBuilder' );


    },
    establishRealTimeCom: function () {
        var me = this;
        this.socket = io.connect(this.fullPath);
        me.getArtifactsStore().getProxy().setSocket(me.socket);
        me.getConnectionsStore().getProxy().setSocket(me.socket);
        //me.getContentsStore().getProxy().setSocket(me.socket);
        me.getCommentsStore().getProxy().setSocket(me.socket);
        this.socket.on('connected', function (data) {
            console.log(data);
            me.getArtifactsStore().getProxy().removeEvents(me.socket);
            me.getArtifactsStore().getProxy().bindEvents(me.socket);
            me.getConnectionsStore().getProxy().removeEvents(me.socket);
            me.getConnectionsStore().getProxy().bindEvents(me.socket);
            me.getCommentsStore().getProxy().removeEvents(me.socket);
            me.getCommentsStore().getProxy().bindEvents(me.socket);
            /*me.getContentsStore().getProxy().removeEvents(me.socket);
            me.getContentsStore().getProxy().bindEvents(me.socket);*/

        });

    },
    launch: function () {
        var me = this;
        Ext.state.Manager.setProvider( Ext.create( 'Ext.state.CookieProvider' ) );
        Ext.tip.QuickTipManager.init();
        me.createViewport();
        this.loadActivity();
        this.loadUser();

    },
    initMainContentCmp: function () {
        this.mainContentCmp = Ext.create( 'Ext.tab.Panel', {
            region: 'center', // a center
            deferredRender: false,
            margins: '0 0 0 5',
            activeTab: 0
        } );
        this.mainContentCmp.loadMask = new Ext.LoadMask( this.mainContentCmp, {msg: "Loading, please wait..."} );
    },
    initNorthPanelCmp: function () {
        this.initTopToolBarCmp();
        this.northPanelCmp = Ext.create( 'Ext.panel.Panel', {
            id: 'top_panel',
            region: 'north',
            layout: 'anchor',
            frame: false,
            border: false,
            bodyStyle: 'background:transparent; padding: 5px',
            items: [
                this.topToolBarCmp
            ]

        } );
    },
    initSouthPanelCmp: function () {
        this.initButtonStatusBarCmp();
        this.southPanelCmp = Ext.create( 'Ext.panel.Panel', {
            region: 'south',
            border: false,
            bodyStyle: 'background:transparent; padding: 5px',
            items: [
                this.buttonStatusBarCmp
            ]
        } );
    },
    initEastPanelCmp: function () {
        this.eastPanelCmp = Ext.create( 'Ext.tab.Panel', {
            stateful: true,
            stateId: 'east_panel',
            region: 'east',
            title: 'Property',
            collapsible: true,
            collapsed: true,
            split: true,
            width: 300,
            minWidth: 220,
            margins: '0 5 0 0',
            tabPosition: 'bottom'
        } );
    },
    initTitleCmp: function () {
        this.titleCmp = Ext.create( 'Ext.Component', {
            region: 'north',
            margin: '0',
            autoEl: {
                tag: 'div',
                html: '<p style="font-size: 15px; font-weight: bold; color: rgb(21, 127, 204); margin: 0 5px 0 5px">Application Tool</p>'
            }
        } );
    },
    initCommOpBarCmp: function () {
        this.commOpBarCmp = Ext.create( 'Ext.toolbar.Toolbar', {
            id: 'authoring_panel_tbar_comm',
            style: 'padding: 0; margin: 0; border: none'
        } );
    },
    initTopToolBarCmp: function () {
        this.initTitleCmp();
        this.topToolBarCmp = Ext.create( 'Ext.Toolbar', {
            style: 'padding-left: 0',
            items: [
                this.titleCmp,
                { xtype: 'tbspacer', width: 50 }
            ]
        } );
    },
    initButtonStatusBarCmp: function () {
        this.buttonStatusBarCmp = Ext.create( 'Ext.ux.StatusBar', {
            id: 'app-status',
            style: 'padding-left: 0',
            border: false,

            defaultText: '',
            defaultIconCls: 'x-status-valid',
            text: 'Ready',
            iconCls: 'x-status-valid'
        } );
    },
    initPropertyForm: function () {
        var me = this;
        this.ajax.loadPropertyForm( function ( form ) {
            me.propertyForm = form;
        } );
    },
    createViewport: function ( activity ) {
        var me = this;
        Ext.create( 'Ext.Viewport', {
            id: 'application_viewpoint',
            layout: 'border',
            items: [
                me.northPanelCmp,
                me.mainContentCmp,
                me.eastPanelCmp,
                me.southPanelCmp
            ]
        } );
        // this.openActivity(activity);
    },
    createConnection: function ( sourcePort, targetPort ) {
        var me = this;
        if ( me.currentCanvas.isDupConnection( sourcePort, targetPort ) ) {
            return false
        }
        var conn = new App.node.Connection();
        conn.entityType = 'connection';
        conn.activityId = me.activity.get('_id');
        var task = new Ext.util.DelayedTask(function(){
            me.getController('board' ).fireEvent('createconnection', conn, me.currentCanvas);
        });
        task.delay(100);
        return conn;
    },
    loadActivity: function (  ) {
        var me = this;
        this.mainContentCmp.loadMask.show();
        this.getActivityModel().load(activityId,{
            success:function(activity){
                me.activity= activity;
                me.fireEvent('openwhiteboard', me.mainContentCmp, me.activity);
                me.mainContentCmp.loadMask.hide();
            },
            failure:function(){
                Ext.Error.raise('something went wrong with the server');
            }/*,
            params:{
                _id:activityId
            }*/
        });

    },
    loadUser:function(){
        var me = this;
        this.getUserModel().load(userId,{
            success: function(user){
                me.user= user;
            }
        })
    },
    addCmdButtons: function ( btns ) {
        this.commOpBarCmp.add( btns );
    },
    createNewTab: function ( config ) {
        var tabItem = this.mainContentCmp.add( config );
        tabItem.show();
        this.mainContentCmp.setActiveTab( tabItem );
        tabItem.fireEvent( 'tabactivate', tabItem );
        return tabItem;
    }
} );


//Start
Ext.onReady( function () {
    document.oncontextmenu= function(){
        return true;
    };
    app = Ext.create( 'App.Application' );
    draw2d.Connection.createConnection = function ( sourcePort, targetPort ) {
        return App.current.createConnection( sourcePort, targetPort );
    };
    draw2d.util.UUID.create = function () {
        var id = App.current.util.uuid();
        return id.replace( '-', '' );
    };
} );
