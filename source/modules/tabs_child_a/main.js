function TabsModuleA(parentElement) {
    this.name = $(parentElement).attr('module');
    this.path = './modules/' + this.name + '/';
    this.parentElement = parentElement;
    this.currentTabModule = {};
    this.activeTabIndex = 0;
    // contins tab-children parent div without inner HTML
    this.tabChildren = [];

    this.render();
}

TabsModuleA.prototype.render = function() {
    var _this = this;

    // load module HTML
    // $.get(_this.path + 'index.html', function(moduleHtml) {
        _this.tabLabelContainer = $(_this.parentElement).children('.tab_labels_container');
        _this.tabLabel = $(_this.tabLabelContainer).children('.tab_label');
        $(_this.tabLabelContainer).children('.tab_label').remove();       
        _this.tabChildren = $(_this.parentElement).children('div[module]');

        _this.createAppendTabChildrenModule();
        _this.createPrependTabLabels();
        _this.showCurrentModuleAndLabel();
    // });
};

TabsModuleA.prototype.createPrependTabLabels = function() {
    var _this = this;
    var tabs = _this.tabChildren;

    for (var i = 0; i < tabs.length; i++) {
        var name = $(tabs[i]).attr('module');

        var label = $(_this.tabLabel).clone().html(name).attr('moduleindex', i);
        $(_this.tabLabelContainer).append(label);
    }

    var currentLabel = $(_this.tabLabelContainer).children('.tab_label')[_this.activeTabIndex];
    $(currentLabel).addClass('active');

    // add change tab on click function
    $(_this.tabLabelContainer).find('.tab_label').on('click', function(e) {
        _this.changeTab(this);
    });
};

// called on label click
TabsModuleA.prototype.changeTab = function(label) {
   var _this = this;

    // remove currentTabModule HTML parent-element content
    $(_this.parentElement).children('.tab.active').unbind();

    // remove currentTabModule refferences
    $(_this.currentTabModule.parentElement).children().remove();
    removeObject(_this.currentTabModule);

    // hide last active modules (remove .active css class)
    $(_this.parentElement).find('.active').removeClass('active');
    // remove all imported module containers
    $(_this.parentElement).find('.module_container').remove();

    // save clicked label tab-index
    _this.activeTabIndex = $(label).attr('moduleindex');
    // generate new module
    _this.createAppendTabChildrenModule();

    _this.showCurrentModuleAndLabel();
};

TabsModuleA.prototype.createAppendTabChildrenModule = function() {
    var _this = this;

    // create module 
    _this.moduleParentElement = $(_this.tabChildren[_this.activeTabIndex])[0];
    moduleFactory(_this.moduleParentElement, function(module){
        _this.currentTabModule = module;
        console.log('_this.currentTabModule ' , _this.currentTabModule);
    });
};

TabsModuleA.prototype.showCurrentModuleAndLabel = function() {
    var _this = this;

    $(_this.moduleParentElement).addClass('active');
    $(_this.parentElement).find('.tab_label[moduleindex="' + _this.activeTabIndex + '"]').addClass('active');
};
