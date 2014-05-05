/**
 * Created by fonpah on 05.04.2014.
 */
Ext.define( 'App.util.Util', {
    statics: {
        decodeJSON: function ( text ) {

            var result = Ext.JSON.decode( text, true );

            if ( !result ) {
                result = {};
                result.success = false;
                result.message = text;
            }

            return result;
        }
    },
    required: '<span style="color:#ff0000;font-weight:bold" data-qtip="Required">*</span>',
    capitalizeFirstChar: function ( str ) {
        var s = str.charAt( 0 ).toUpperCase() + str.substring( 1 );
        return s;
    },

    showErrorMsg: function ( text ) {
        Ext.Msg.show( {
            title: 'ERROR',
            msg: text || 'Oh no',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        } );
    },
    showSuccessMsg: function ( text ) {
        Ext.Msg.show( {
            title: 'SUCCESS',
            msg: 'OK',
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        } );
    },
    capitaliseFirstLetter: function ( string ) {
        if ( string ) {
            return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
        } else {
            return null;
        }

    },

    replaceAll: function ( str, find, replace ) {
        return str.replace( new RegExp( find, 'g' ), replace );
    },
    shortenString: function ( str, maxLength ) {
        if ( str && str.length > maxLength ) {
            str = str.substring( 0, maxLength - 2 ) + ' ...';
        }

        return str;
    },
    uuid: function(){
        var id=  Ext.data.IdGenerator.get('uuid').generate();
        return id.replace(/-/g,'');
    }

} );