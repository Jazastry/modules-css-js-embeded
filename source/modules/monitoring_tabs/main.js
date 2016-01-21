function MonitoringTabsModule(parentElement) {
    this.name = $(parentElement).attr('module');
    this.path = './modules/' + this.name + '/';
    this.parentElement = parentElement;
    this.prepare();
}

MonitoringTabsModule.prototype.prepare = function() {
    var _this = this;

    // prepend interactive module channels html to select_chanel_dialog radio buttons
    $.each($('div[module="interactive"]').find('.interactive_channel'), function(i, channel) {
        var channelName = $(channel).attr('id');
        $(_this.parentElement).find('.select_chanel_dialog>h4')
            .after('<label><input type="radio" name="channel" value="' + channelName + '"><i>' + channelName + '</i></label><br>');
    });

    _this.loadEvents();
};

MonitoringTabsModule.prototype.remove = function() {
    var _this = this;

    // call current module remove function
    _this.currentTabModule.remove();

    // unbind all attached events and remove all HTML elements
    $(_this.parentElement).children().unbind();
    $(_this.parentElement).children().remove();
    $(_this.parentElement).children().find("*").addBack().unbind();
    $(_this.parentElement).children().find("*").addBack().remove();

    // remove all function instances
    removeObject(_this);
};

MonitoringTabsModule.prototype.loadEvents = function() {
    var _this = this;

    $(_this.parentElement).find('.select_chanel_dialog>button.channel_submit').on('click', function(e) {
        var channelName = $(_this.parentElement).find(".select_chanel_dialog input:radio[name=channel]:checked").val();
        _this.addMonitoringModule(channelName);
        $(_this.parentElement).find('.select_chanel_dialog').hide();
    });

    $(_this.parentElement).find('.select_chanel_dialog>button.hide_select_chanel_dialog').on('click', function(e) {
        $(_this.parentElement).find('.select_chanel_dialog').hide();
    });

    $('#monitoring_tabs_add_module_button').on('click', function(e) {
        $(_this.parentElement).find('.select_chanel_dialog').show();
    });
};

MonitoringTabsModule.prototype.addMonitoringModule = function(channelName) {
    var _this = this;

    var moduleName = 'monitoring';
    var modulePath = './modules/' + moduleName + '/';
    var monitoringParent = $(_this.parentElement).find('div[module="monitoring"]').first().clone();
    $(monitoringParent).removeClass('template');

    // load module js it is not loaded
    if (!$('script[src="' + modulePath + 'main.js"]').length) {
        $('body').append('<script type="text/javascript" src="' + modulePath + 'main.js"></script>');
    }

    var module = new MonitoringModule(monitoringParent, channelName);
    $(monitoringParent).find('.monitoring_tabs_remove_module_button').on('click', function(e) {
        module.remove();
    });

    // load module html
    $.get(modulePath + 'index.html', function(htmlData) {
        $(module.parentElement).append(htmlData);
        module.loadEvents();
        module.loadChannelInfo();
    });

    $(_this.parentElement).find('div[module="monitoring"]').last().after(monitoringParent);
};
