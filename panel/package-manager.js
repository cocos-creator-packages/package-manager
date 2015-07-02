(function () {
var Path = require('fire-path');
var _ = require('lodash');

function _createPackageInfo ( result ) {
    return {
        enabled: result.enabled,
        builtin: result.builtin,
        hasTests: result.info.tests && result.info.tests.length > 0,
        info: result.info,
    };
}

Editor.registerPanel( 'package-manager.panel', {
    is: 'package-manager',

    properties: {
        filterText: {
            type: String,
            value: ''
        }
    },

    ready: function () {
        Editor.Package.queryInfos(function ( results ) {
            var packages = results.map( function (item) {
                return _createPackageInfo(item);
            });
            this.set( 'packages', packages );
        }.bind(this));
    },

    'package:loaded': function ( name ) {
        Editor.Package.queryInfo(name, function ( result ) {
            this.push( 'packages', _createPackageInfo(result));
        }.bind(this));
    },

    'package:unloaded': function ( name ) {
        var idx = _.findIndex( this.packages, function ( item ) {
            return item.info.name === name;
        });
        this.splice( 'packages', idx, 1 );
    },

    _onReload: function (event) {
        event.stopPropagation();

        var model = this.$.list.modelForElement(event.target);
        var oldname = model.item.info.name;
        Editor.Package.reload(oldname);
    },

    _onTest: function (event) {
        event.stopPropagation();

        var item = this.$.list.itemForElement(event.target);
        Editor.Panel.open( 'tester.panel', {
            name: item.info.name,
        });
    },

    _enabledText: function (enabled) {
        if (enabled) {
            return 'Disable';
        }
        else {
            return 'Enable';
        }
    },

    _sortPackages: function ( a, b ) {
        return a.info.name.localeCompare( b.info.name );
    },

    applyFilter: function (packages,filterText) {
        if (!filterText) {
            return packages;
        }

        var _packages = [];
        var filter = filterText.toLowerCase();
        for (var i = 0; i < packages.length; ++i) {
            if (packages[i].info.name.toLowerCase().match(filter)) {
                _packages.push(packages[i]);
            }
        }
        if (_packages.length <= 0) {
            this.$.none.hidden = false;
        }
        else {
            this.$.none.hidden = true;
        }

        return _packages;
    },
});

})();
