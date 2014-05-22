/**
 * Created by fonpah on 15.05.2014.
 */

Ext.define('App.draw.Canvas',{
    extend: 'draw2d.Canvas',
    installedPolicies:{},
    activity: null,
    currentTarget:null,
    ioReader: new draw2d.io.json.Reader(),
    ioWriter: new draw2d.io.json.Writer(),
    constructor: function(config){
        this.callParent([config.placeId]);
        this.setScrollArea('#'+config.placeId);
        this.el = Ext.get(config.placeId);
        this.addSelectionListener(this);
        this.addContextListener();
        this.activity = config.activity;
        this.removalStack=[];
        this.commandStack.addEventListener( this );
    },
    onDrop: function ( droppedDomNode, x, y ) {
        app.getController('board' ).fireEvent('drop',this, droppedDomNode, x, y);

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
        app.getController('board' ).fireEvent('contextmenu',this, event);

    },
    onSelectionChanged: function ( figure ) {
        this.currentTarget= figure;
        if(figure instanceof draw2d.SetFigure){
            app.getController('property').fireEvent('createpropertyform',figure, this);
        }
        else if(figure instanceof draw2d.Connection){
        }else{
            app.getController('property').fireEvent('collapsepropertyform',this);
        }
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
        this.el.on( 'dblclick', me.openContentWindow, this );
    },
    openContentWindow: function(){
        var me = this;
        app.getController('board' ).fireEvent('dblclick',this, this.currentTarget);
    },
    removeContextListener: function () {
        var me = this;
        this.el.removeListener( 'contextmenu', me.showContextMenu, this );
        this.el.removeListener( 'dblclick', me.openDomainFromFigure, this );
    },
    stackChanged: function ( event ) {
        app.getController('controls' ).fireEvent('stackchanged', this, event);
    }
});