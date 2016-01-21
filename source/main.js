// load InfoChannel service
$('body').append('<script src="./js/services/InfoChannel.js"></script>');

// factory for registered modules
var moduleFactory = function(moduleParentElement, callback) {

    var module = {};
    var moduleName = $(moduleParentElement).attr('module');
    var modulePath = './modules/' + moduleName + '/';

    $(moduleParentElement).load(modulePath + 'index.html', function() {

        // module factory
        switch (moduleName) {
            case 'hello':
                break;
            case 'monitoring':
                module = new MonitoringModule(moduleParentElement);
                break;
            case 'interactive':
                module = new InteractiveModule(moduleParentElement);
                break;
            case 'tabs':
                module = new TabsModule(moduleParentElement);
                break;
            case 'tabs_child_a':
                module = new TabsModuleA(moduleParentElement);
                break;
            case 'tabs_child_b':
                module = new TabsModuleB(moduleParentElement);
                break;
            case 'monitoring_tabs':
                module = new MonitoringTabsModule(moduleParentElement);
                break;
            default:
                throw new Error('Module Factory - Not implemented module: ' + moduleName);
        }

        if (callback) {
            return callback(module);
        }
    });
};

// object and properties removal 
var removeObject = function(obj) {

    for (var member in obj) {        
        // preserve channel value from deletion
        if (member !== 'channel') {
            delete obj[member];
        }
    }

    obj = null;
};

// load nad render one level modules
var renderOneLevelModules = function(moduleParentElement) {
    var oneLevelModules = $(moduleParentElement).children('div[module]').not('div[module]>div[module]');

    for (var i = 0; i < oneLevelModules.length; i++) {
        moduleFactory(oneLevelModules[i]);
    }
};

// select main modules container and pass it to render function
renderOneLevelModules($('body>.container'));
