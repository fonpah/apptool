/**
 * Created by fonpah on 02.05.2014.
 */
var app= null;
Ext.define( 'App.Application', {
    name: 'App',
    extend: 'Ext.app.Application',
    appFolder: '/ui/whiteboard',
    postfixNr:0,
    appProperty: 'current',
    currentCanvas:null,
    splashscreen: {},
    init: function () {
        splashscreen = Ext.getBody().mask( 'Loading Application', 'splashscreen' );
        splashscreen.addCls( 'splashscreen' );
        Ext.DomHelper.insertFirst( Ext.query( '.x-mask-msg' )[0], {
            cls: 'x-splash-icon'
        } );
        this.defaultRouter= new draw2d.layout.connection.SplineConnectionRouter();
        this.util = Ext.create( 'App.util.Util' );
        this.ajax = Ext.create( 'App.util.Ajax' );
        this.initMainContentCmp();
        this.initNorthPanelCmp();
        this.initSouthPanelCmp();
        this.initEastPanelCmp();
        this.initPropertyForm();
        this.propertyFormBuilder = Ext.create('App.builder.PropertyFormBuilder');
        this.contentFormBuilder = Ext.create('App.builder.ContentFormBuilder');

    },
    launch: function () {
        var me = this;
        Ext.state.Manager.setProvider( Ext.create( 'Ext.state.CookieProvider' ) );
        Ext.tip.QuickTipManager.init();
        var task = new Ext.util.DelayedTask( function () {
            splashscreen.fadeOut( {
                duration: 2000,
                remove: true
            } );
        } );

        splashscreen.next().fadeOut( {
            duration: 2000,
            remove: true,
            listeners: {
                afteranimate: function ( el, startTime, eOpts ) {
                    me.createViewport();
                }
            }
        } );
        task.delay( 1000 );
    },
    initMainContentCmp: function () {
        this.mainContentCmp = Ext.create( 'Ext.tab.Panel', {
            region: 'center', // a center
            deferredRender: false,
            margins: '0 0 0 5',
            activeTab:0
        } );
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
        this.initCommOpBarCmp();
        this.topToolBarCmp = Ext.create( 'Ext.Toolbar', {
            style: 'padding-left: 0',
            items: [
                this.titleCmp,
                { xtype: 'tbspacer', width: 50 },
                this.commOpBarCmp
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

            // values to set initially:
            text: 'Ready',
            iconCls: 'x-status-valid'

            // any standard Toolbar items:
            //items: ['-', 'Build: ' + devInfoStr]
        } );
    },
    initPropertyForm: function(){
        var me = this;
        this.ajax.loadPropertyForm(function(form){
            me.propertyForm = form;
        });
    },
    updatePropertyFormPanel: function(form){
        var me = this;
        if(!form){
            return;
        }
        if(!Ext.get(form.getId())){
            me.eastPanelCmp.add(form);
        }
        me.eastPanelCmp.setActiveTab(form);
        me.eastPanelCmp.expand();
    },
    createViewport: function () {
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
        this.openActivity();
    },
    createConnection: function ( sourcePort, targetPort ) {
        var me = this;
        if(me.currentCanvas.isDupConnection(sourcePort, targetPort)){
            return false
        }
        var conn = new App.node.Connection();
        conn.entityType = 'connection';
        return conn;
    },
    openActivity: function () {
        var activity = null;
        activity = Ext.create( 'App.activity.CreateActivity',{
            ajax: this.ajax,
            util: this.util
        } );
        activity.loadActivity('5367ffbab77611b15e4a88d1');
    },
    addCmdButtons: function ( btns ) {
        this.commOpBarCmp.add( btns );
    },
    createNewTab: function ( config ) {
        var tabItem = this.mainContentCmp.add( config );
        tabItem.show();
        this.mainContentCmp.setActiveTab(tabItem);
        tabItem.fireEvent('tabactivate',tabItem);
        return tabItem;
    },
    collapsePropertyFormPanel: function(){
        this.eastPanelCmp.collapse();
    },
    openContentWindowFromFigure: function(activity, figure){
        var me = this;
        Ext.create('Ext.window.Window',{
            title:me.util.shortenString(figure.title,11),
            closable:true,
            minWidth:500,
            layout:'fit',
            minHeight:300,
            modal:true,
            padding:5,
            html:figure.content || 'No Content Available'
        } ).show();
    }

} );







//Start
Ext.onReady( function () {
    Ext.create( 'App.Application' );
    draw2d.Connection.createConnection= function(sourcePort, targetPort){
      return App.current.createConnection(sourcePort, targetPort);
    };
    draw2d.util.UUID.create = function(){
        var id =App.current.util.uuid();
        return id.replace('-','');
    };
} );
