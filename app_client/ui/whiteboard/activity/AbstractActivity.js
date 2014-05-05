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
    createFigurePool: function ( holderTpl ) {

    },
    createWorkspace: function () {
        this.canvas = Ext.create( 'App.draw.Canvas', {placeId: this.canvasHolderEltId, activity: this} );

        if ( this.isReadOnly ) {
            this.canvas.addPolicy( 'readOnly', 'draw2d.policy.canvas.ReadOnlySelectionPolicy' );
            this.canvas.addPolicy( 'grid', 'draw2d.policy.canvas.SnapToGridEditPolicy' );
            this.title = '[ReadOnly] ' + this.title;
        } else {
            this.canvas.addPolicy( 'geometry', 'draw2d.policy.canvas.SnapToGeometryEditPolicy' );
        }
        this.commandButtons = Ext.create( 'App.operator.CommandButtons', {activity: this} );
        this.zoomButtons = Ext.create( 'App.operator.ZoomButtons', {
            activity: this
        } );
        this.editButtons = Ext.create( 'App.operator.EditButtons', {activity: this} );
        this.contextMenu = Ext.create( 'App.operator.ContextMenu', {activity: this} );
        this.tab = App.current.createNewTab( this.getTabConfig() );
    },
    loadActivity: function ( id ) {
        var me = this;
        this.ajax.loadActivity( id, function ( json ) {
            me.setRawData( json );
            me.title = json.title;
            me.description = json.description;
            me.isReadOnly = json.status == 0 || json.status == 2 ? true : false;
            me.canvasHolderEltId = json._id;
            me.createHolderElement( me.canvasHolderEltId );
            me.tabId = 'tab_' + me.canvasHolderEltId;
            me.activityId = json._id;
            me.createWorkspace();
        } );
    },
    getTabConfig: function () {
        var me = this;
        return {
            id: this.tabId,
            contentEl: this.canvasHolderEltId + '_holder',
            activity: this,
            autoScroll: true,
            closable: true,
            glyph: 'xf069@fa',
            title: App.current.util.shortenString( this.title, 20 ),
            listeners: this.getTabListeners()
        };
    },
    getTabListeners: function () {
        var me = this;
        return  {
            tabactivate: function ( tab ) {
                App.current.currentCanvas = me.canvas;
                tab.activity.zoomButtons.show();
                tab.activity.editButtons.show();
                tab.activity.commandButtons.show();
            },
            deactivate: function ( tab ) {
                tab.activity.zoomButtons.hide();
                tab.activity.editButtons.hide();
                tab.activity.commandButtons.hide();
            },
            close: function ( tab ) {
                tab.activity.zoomButtons.remove();
                tab.activity.editButtons.remove();
                tab.activity.commandButtons.remove();
                tab.activity.canvas.removeContextListener();
                tab.destroy();
            }
        }
    },
    onDrop: function ( figure ) {
        var me = this;
       /* var form = $.extend(true,{},App.current.propertyForm);
        var id = me.util.uuid();
        figure.propertyForm = App.current.propertyFormBuilder.buildForm( {
            fields: form.fields,
            buttons: form.buttons,
            formId: id,
            title: App.current.util.shortenString( figure.title, 11 ),
            figure: figure
        } );
        figure.contentForm = App.current.contentFormBuilder.buildForm({figure:figure});
        App.current.updatePropertyFormPanel( figure.propertyForm );*/
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