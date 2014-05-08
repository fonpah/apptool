/**
 * Created by fonpah on 03.05.2014.
 */
Ext.define( 'App.activity.AbstractActivity', {
    requires: [
        'App.node.Artifact',
        'App.builder.PropertyFormBuilder',
        'App.builder.ContentFormBuilder',
        'App.io.Reader',
        'App.draw.Canvas',
        'App.operator.CommandButtons',
        'App.operator.ContextMenu',
        'App.operator.EditButtons',
        'App.operator.ZoomButtons'
    ],
    config: {
        rawData: null
    },
    ajax: null,
    util: null,
    tabId: null,
    type: null,
    title: null,
    isReadOnly: false,
    canvasHolderEltId: null,
    zoomButtons: null,
    contextMenu:null,
    canvas: null,
    currentTarget:null,
    tab: null,
    ioReader: new draw2d.io.json.Reader(),
    ioWriter: new draw2d.io.json.Writer(),
    createHolderElement: function ( canvasHolderEltId ) {
        var holderTemplate = $( '#draw_space_holder_template' ).clone();
        holderTemplate.attr( 'id', canvasHolderEltId + '_holder' );
        this.createFigurePool( holderTemplate );
        holderTemplate.children().eq( 1 ).attr( 'id', canvasHolderEltId );
        holderTemplate.appendTo( '#authoring_space_el' );
    },
    constructor:function(config){
        this.setRawData( config.activity );
        this.title = config.activity.title;
        this.description = config.activity.description;
        this.status = config.activity.status;
        this.canvasHolderEltId = config.activity._id;
        this.createHolderElement( this.canvasHolderEltId );
        this.tabId = 'tab_' + this.canvasHolderEltId;
        this.activityId = config.activity._id;
        this.createWorkspace();
        App.current.mainContentCmp.loadMask.hide();
    },
    createFigurePool: function ( holderTpl ) {

    },
    createWorkspace: function () {
        this.canvas = Ext.create( 'App.draw.Canvas', {placeId: this.canvasHolderEltId, activity: this} );
        this.canvas.addPolicy( 'geometry', 'draw2d.policy.canvas.SnapToGeometryEditPolicy' );
        this.zoomButtons = Ext.create( 'App.operator.ZoomButtons', {
            activity: this
        } );

    },
/*    loadActivity: function ( id ) {
        var me = this;
        this.ajax.loadActivity( id, function ( json ) {
            me.setRawData( json );
            me.title = json.title;
            me.description = json.description;
            me.status = json.status == 0 || json.status == 2 ? true : false;
            me.canvasHolderEltId = json._id;
            me.createHolderElement( me.canvasHolderEltId );
            me.tabId = 'tab_' + me.canvasHolderEltId;
            me.activityId = json._id;
            me.createWorkspace();
        } );
    },*/
    onDrop: function ( figure ) {
        var me = this;

    },
    onSelectionChanged: function ( figure ) {
        var me =this;
        if ( figure !== null ) {
            App.current.updatePropertyFormPanel( figure.propertyForm );
        } else {
            App.current.collapsePropertyFormPanel();
        }
        me.currentTarget = figure;
    }

} );