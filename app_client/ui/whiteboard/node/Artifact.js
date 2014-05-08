/**
 * Created by fonpah on 02.05.2014.
 */
Ext.define('App.node.Artifact', {
    extend: 'App.node.AbstractFigure',
    config: {

    },
    constructor: function () {
        this.callParent();
        this.NAME = 'App.node.Artifact';
        this.DEFAULT_COLOR = new draw2d.util.Color("#95D080");
        // this.model = 'meta';
        this.entityType = 'artifact';
        this.alias =  this.entityType;
        this.aliasText = 'Artifact';
        this.inputLocator = new this.MyInputPortLocator();
        this.outputLocator = new this.MyOutputPortLocator();
        this.createPort("input", this.inputLocator);
        this.createPort("input", this.inputLocator);
        this.createPort("output", this.outputLocator);
        this.createPort("output", this.outputLocator);
        this.title = 'Artifact'+App.current.postfixNr;
        App.current.postfixNr++;
        this.label.setText(this.title);
        var form = $.extend(true,{},App.current.propertyForm);
        var id =  App.current.util.uuid();
        this.propertyForm = App.current.propertyFormBuilder.buildForm( {
            fields: form.fields,
            buttons: form.buttons,
            formId: id,
            title: App.current.util.shortenString( this.title, 11 ),
            figure: this
        } );
        this.contentForm = App.current.contentFormBuilder.buildForm({figure:this});

    },
    createSet: function () {
        var set = this.canvas.paper.set();
        this.icon = this.canvas.paper.path(this.figurePaths.paper1);
        this.icon.attr({fill:this.DEFAULT_COLOR.hash()});
        set.push(this.icon);
        return set;
    }
});