/**
 * Created by fonpah on 27.04.2014.
 */
Ext.define('App.draw.Canvas',{
    extend: 'draw2d.Canvas',
    installedPolicies:{},
    activity: null,
    currentTarget:null,
    constructor: function(config){
        this.callParent([config.placeId]);
        this.setScrollArea('#'+config.placeId);
        this.el = Ext.get(config.placeId);
        this.addSelectionListener(this);
        this.addContextListener();
        this.addSelectionListener(config.activity);
        this.activity = config.activity;
        this.removalStack=[];
    },
    onDrop: function ( droppedDomNode, x, y ) {
        if(this.activity.isReadOnly){
            return false;
        }
        var type = $( droppedDomNode ).data( "shape" );
        this.uxAddFigure( type, null, false, x, y );

    },
    addPolicy: function(alias,policy){
        if(!this.installedPolicies[alias]){
            this.installedPolicies[alias] = eval('new ' +policy+'()');
        }
        this.installEditPolicy(this.installedPolicies[alias]);
    },
    removePolicy : function(policy){
        if(this.installedPolicies[policy]) {
            this.uninstallEditPolicy( this.installedPolicies[policy] );
        }
    },
    showContextMenu: function ( event ) {
        var me = this;
        event.preventDefault();
        me.activity.contextMenu.getDrawspaceCtxMenu().showAt(event.getXY());

    },
    onSelectionChanged: function ( figure ) {
        this.currentTarget= figure;
    },
    uxAddFigure: function ( type, title, isInAutoAddSection, x, y ) {
        var me = this;
        var figure;
        figure = this.createFigure( type, title, isInAutoAddSection, x, y );
        me.activity.onDrop(figure);

    },
    createFigure: function ( type, title, isInAutoAddSection, x, y ) {
        var figure = Ext.create( type );
        figure.activityId = this.activity.activityId;
        if ( title ) {
            figure.updateTitle( title, true );
        }
        if ( isInAutoAddSection ) {
            figure.isInAutoAddSection = true;
        }
        this.addFigure( figure, x - 25, y - 25 );
        return figure;
    },
    isDupConnection: function (sourceFigure, targetFigure) {
        var lines = this.lines;
        var count = lines.getSize();
        var line;
        for (var i = 0; i < count; i++) {
            line = lines.get(i);
            if ((line.getSource().parent.id === sourceFigure.id) && (line.getTarget().parent.id === targetFigure.id)) {
                return true;
            }
        }
        return false;
    },
    addContextListener: function () {
        var me = this;
        this.el.on( 'contextmenu', me.showContextMenu, this );
        this.el.on( 'dblclick', me.onDblClick, this );
    },
    onDblClick:function(){
        console.log(arguments);
    },
    removeContextListener: function () {
        var me = this;
        this.el.removeListener( 'contextmenu', me.showContextMenu, this );
        this.el.removeListener( 'dblclick', me.openDomainFromFigure, this );
    }
});