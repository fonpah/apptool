/**
 * Created by fonpah on 04.04.2014.
 */
Ext.define( 'App.builder.PropertyFormBuilder', {
    isReadOnly: false,
    constructor: function ( config ) {
    },
    buildForm: function ( config ) {
        var controller = config.controller;
        var fields = this.buildFields( config.fields, config.figure ,controller);
        var form = Ext.create( 'Ext.form.Panel', {
            title: config.title,
            items: fields || [],
            itemId: config.itemId,
            listeners: this.propertyFormListener(),
            margin: '5'
        } );
        form.figure = config.figure;
        return form;
    },
    buildFields: function ( fields, figure, controller) {
        var model = controller.getArtifactsStore().findRecord('id',figure.id,0,false,true,true);
        for ( var i = 0; i < fields.length; i++ ) {
            if ( fields[i]['required'] ) {
                fields[i]['afterLabelTextTpl'] = App.current.util.required;
                fields[i]['allowBlank'] = false;
                delete fields[i]['required']
            }
            if ( !fields[i]['value'] ) {
                fields[i]['value'] = figure[fields[i]['name']];
            }
            if ( fields[i]['listeners'] ) {
                var listeners = this.buildPropertyFormItemListener( fields[i]['listeners'],controller );
                fields[i]['listeners'] = listeners;
            }
            if(!controller.isAuthorized(model)){
                fields[i]['disabled']= true;
            }
            /*if(this.isReadOnly){
                fields[i]['disabled']= true;
            }*/
        }
        return fields;
    },
    buildButtons: function ( buttons, figure ) {
        for ( var i = 0; i < buttons.length; i++ ) {
            if ( buttons[i]['handler'] == 'save' ) {
                buttons[i]['handler'] = this.onSave
            }
            if ( buttons[i]['handler'] == 'reset' ) {
                buttons[i]['handler'] = this.onReset
            }
            if(this.isReadOnly){
                buttons[i]['disabled']= true;
            }
        }
        return buttons;
    },
    buildPropertyFormItemListener: function ( listeners, controller ) {
        var me = this;
        var events = {scope:controller};
        Ext.Object.each( listeners, function ( event, handler ) {
            if ( handler == 'changeTitle' ) {
                events[event] = controller.onChangeTitle;
            }
            if ( handler == 'changeDescription' ) {
                events[event] = controller.onChangeDescription;
            }
        } );
        return events;
    },
    propertyFormListener: function () {
        return {};
    },
    /** Events**************************/
    onSave: function ( cmp ) {
        if ( cmp.up( 'form' ).getForm().isValid() ) {
            //App.current.ajax.saveArtifact(cmp.up( 'form' ).figure);
        }
        else {
            App.current.util.showErrorMsg( 'validation failed' );
        }
    },
    onReset: function ( cmp ) {
        App.current.eastPanelCmp.collapse();
    },
    onChangeTitle: function ( cmp ) {
        var title = $.trim( cmp.getValue() );
        if ( title.length !== 0 ) {
            cmp.up( 'form' ).figure.updateTitle( title, true );
            cmp.up( 'form' ).setTitle( App.current.util.shortenString( title, 11 ) );
        }
    },
    onChangeDescription: function ( cmp ) {
        var me = this;
        var description = $.trim( cmp.getValue() );
        if ( description.length !== 0 ) {
            cmp.up('form' ).figure.decsription = description;
        }
    },
    onBlur: function(cmp){
        var me = this;
        var text = $.trim(cmp.getValue());
        if(text.length!==0){
            console.log('blur');
        }
    }


} );
