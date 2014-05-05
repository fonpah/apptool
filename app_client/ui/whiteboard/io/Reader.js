/**
 * Created by fonpah on 09.04.2014.
 */
Ext.define('App.io.Reader',{
    extend:'draw2d.io.json.Reader',
    constructor: function(config){
        this.callParent();
    },
    unmarshal: function(canvas, json){
        var node = null;
        $.each(json, function (i, element) {
            var o = Ext.create(element.type,{data:element});
            var source = null;
            var target = null;
            for (i in element) {
                var val = element[i];
                if (i === "source") {
                    node = canvas.getFigure(val.node);
                    source = node.getPort(val.port);
                } else {
                    if (i === "target") {
                        node = canvas.getFigure(val.node);
                        target = node.getPort(val.port);
                    }
                }
            }
            if (source !== null && target !== null) {
                o.setSource(source);
                o.setTarget(target);
            }
            o.setPersistentAttributes(element);
            canvas.addFigure(o);
        });
        canvas.calculateConnectionIntersection();
        canvas.getLines().each(function (i, line) {
            line.svgPathString = null;
            line.repaint();
        });
        canvas.linesToRepaintAfterDragDrop = canvas.getLines().clone();
    }
});