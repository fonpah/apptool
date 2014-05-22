/**
 * Created by fonpah on 18.05.2014.
 */
Ext.define( 'App.view.Board', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.whiteboard',
    canvas: null,
    constructor: function ( config ) {
        var model = config.activity;
        this.title = model.get( 'title' );
        this.description = model.get( 'description' );
        this.status = model.get( 'status' );
        this.canvasHolderEltId = model.get( 'id' );
        this.contentEl = this.canvasHolderEltId + '_holder';
        this.createHolderElement( this.canvasHolderEltId );
        this.tabId = 'tab_' + this.canvasHolderEltId;
        this.activityId = model.get( 'id' );
        this.id = this.tabId;
        this.autoScroll = true;
        this.closable = false;
        this.glyph = 'xf069@fa';
        this.callParent( arguments );
        this.createWorkspace();
    },
    createHolderElement: function ( canvasHolderEltId ) {
        var holderTemplate = $( '#draw_space_holder_template' ).clone();
        holderTemplate.attr( 'id', canvasHolderEltId + '_holder' );
        this.createFigurePool( holderTemplate );
        holderTemplate.children().eq( 1 ).attr( 'id', canvasHolderEltId );
        holderTemplate.appendTo( '#authoring_space_el' );
    },
    createFigurePool: function ( holderTpl ) {
        holderTpl.children().eq( 0 ).html( $( '#node_courseActivityInstance' ).clone() );
    },
    createWorkspace: function () {
        this.canvas = Ext.create( 'App.draw.Canvas', {placeId: this.canvasHolderEltId, activity: this} );
        this.canvas.addPolicy( 'geometry', 'draw2d.policy.canvas.SnapToGeometryEditPolicy' );
    }
} );

Ext.define('App.view.CommandToolbar',{
    extend:'Ext.toolbar.Toolbar',
    alias:'widget.commandtoolbar',
    id: 'authoring_panel_tbar_comm',
    style: 'padding: 0; margin: 0; border: none',
    items:[
        {
            xtype:'button',
            iconCls: 'icon_zoom_in',
            action:'zoom-in'
        },
        {
            xtype:'button',
            iconCls: 'icon_zoom_out',
            action:'zoom-out'
        },
        {
            xtype:'button',
            text: '1:1',
            action:'reset'
        },
        '-',
        {
            xtype:'button',
            iconCls: 'icon_undo',
            disabled: true,
            action:'undo'
        },
        {
            xtype:'button',
            iconCls: 'icon_redo',
            disabled: true,
            action:'redo'
        }
    ]
});



Ext.define('App.view.Contextmenu',{
    extend:'Ext.menu.Menu',
    alias:'widget.contextmenu',
    margin: '0 0 10 0',
    items: [

    ]
});

Ext.define('App.view.ContentForm', {
    extend:'Ext.window.Window',
    alias:'widget.contentform',
    closeAction: 'hide',
    width: 400,
    height: 400,
    minHeight: 400,
    layout: 'fit',
    resizable: true,
    modal: true,
    items: Ext.widget('form',{
        layout:{
            type:'vbox',
            align:'stretch'
        },
        border:false,
        bodyPadding:10,
        fieldDefaults:{
            labelAlign:'top',
            labelStyle:'font-weight:bold'
        },
        defaults:{
            margins:'0 0 10 0'
        },
        items:[
            {
                xtype: 'htmleditor',
                name: 'content',
                height: 300,
                allowBlank:false
            }
        ],
        buttons:[
            {
                text: 'Save'
            },{
                text: 'Cancel'
            }
        ]
    })
});
Ext.define( 'App.window.Content', {
    extend:'Ext.window.Window',
    alias:'widget.contentwindow',
    closable: true,
    minWidth: 500,
    layout: 'fit',
    minHeight: 300,
    modal: true,
    padding: 5
} );