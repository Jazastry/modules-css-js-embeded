var TabsModule = (function() {
    function TabsModule(parentElement) {
        this.name = $(parentElement).attr('module');
        this.path = './modules/' + this.name + '/';
        this.parentElement = parentElement;        
        this.currentTabModule = {};
        this.activeTabIndex = 0;
        // save tab-children parent div without inner HTML
        this.tabChildren = [];
        this.loadCss();
        this.render();
    }

    TabsModule.prototype.loadCss = function() {
        var _this = this;

        // loads css if is not loaded
        if ($('head>link[href="' + _this.path + 'style.css"]').length <= 0) {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: _this.path + 'style.css'
            }).appendTo("head");
        }
    };

    TabsModule.prototype.render = function() {
        var _this = this;

        // load module HTML
        $.get(_this.path + 'index.html', function(moduleHtml) {
            _this.tabLabelContainer = $(moduleHtml).children('.tab_labels_container');
            _this.tabChildren = $(moduleHtml).children('div[module]');            
            _this.createAppendTabChildrenModule();            
            _this.createPrependTabLabels();
            _this.showCurrentModuleAndLabel();
        });
    };

    TabsModule.prototype.createPrependTabLabels = function() {
        var _this = this;

        // add parent tab-container guid to parent labels-container
        $(_this.tabLabelContainer).attr('guid', _this.guid);

        var tabs = _this.tabChildren;
        var label = $(_this.tabLabelContainer).children('.tab_label').clone();
        var labelContainer = $(_this.tabLabelContainer);
        $(labelContainer).html('');

        for (var i = 0; i < tabs.length; i++) {
            var tabName = $(tabs[i]).attr('module');
            var newLabel = $(label).clone();
            $(newLabel).html(tabName)
                .attr('moduleIndex', i);
            $(labelContainer).append(newLabel);
        }

        // add change tab on click function
        $(labelContainer).find('.tab_label').on('click', function(e) {
            _this.changeTab(this);
        });

        $(_this.parentElement).prepend(labelContainer);
    };

    // called on label click
    TabsModule.prototype.changeTab = function(label) {
        var _this = this;

        // remove currentTabModule HTML parent-element content
        $(_this.parentElement).children('.tab.active').unbind();
        $(_this.parentElement).children('.tab.active').remove();

        // remove currentTabModule refferences
        _this.currentTabModule.remove();
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

    TabsModule.prototype.createAppendTabChildrenModule = function() {
        var _this = this;

        // create module 
        var moduleParentElement = $(_this.tabChildren[_this.activeTabIndex]).clone();
        _this.currentTabModule = moduleFactory(moduleParentElement);
        $(_this.parentElement).append(_this.currentTabModule.parentElement);
    };

    TabsModule.prototype.remove = function() {
        var _this = this;

        // remove currentTabModule refferences
        _this.currentTabModule.remove();
        removeObject(_this.currentTabModule);

        // remove labels from DOM
        $(_this.parentElement).find('.tab_labels_container').remove();
        // remove modules content
        $(_this.parentElement).find('.module_container').remove();
        // remove guid from parent container
        $(_this.parentElement).removeAttr('guid');

        removeObject(this);
        removeObject(_this);
    };

    TabsModule.prototype.showCurrentModuleAndLabel = function() {
        var _this = this;

        $(_this.parentElement).children(_this.currentTabModule.parentElement).addClass('active');
        $(_this.parentElement).find('.tab_label[moduleindex="' + _this.activeTabIndex + '"]').addClass('active');
    };

    return TabsModule;
}());
