(function () {

var Path = require('fire-path');

Editor.registerPanel( 'package-manager.panel', {
    is: 'package-manager',

    properties: {
    },

    ready: function () {
        Editor.Package.query(function ( results ) {
            var packages = results.map( function (item) {
                return {
                    enabled: item.enabled,
                    builtin: item.builtin,
                    info: item.info
                };
            });
            this.set( 'packages', packages );
        }.bind(this));
    },

    attached: function () {
        EditorUI.update( this, 'packages' );
    },

    _onReload: function (event) {
        event.stopPropagation();

        var item = this.$.list.itemForElement(event.target);
        Editor.Package.reload(item.info.name);
    },

    _onTest: function (event) {
        event.stopPropagation();

        var item = this.$.list.itemForElement(event.target);
        Editor.Package.runTests(item.info.name);
    },

    _enabledText: function (enabled) {
        if (enabled) {
            return 'Disable';
        }
        else {
            return 'Enable';
        }
    },
});

})();
