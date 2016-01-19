var MonitoringTabsModule = (function() {
    function MonitoringTabsModule (parentElement) {
        this.name = $(parentElement).attr('module');
        this.path = './modules/' + this.name + '/';
        this.parentElement = parentElement;
        this.loadCss();
        this.render();
    }

    MonitoringTabsModule.prototype.loadCss = function() {
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

    MonitoringTabsModule.prototype.render = function() {
        var _this = this;

        // load module html
        $.get(_this.path + 'index.html', function(htmlData) {
            $(_this.parentElement).append(htmlData);

            // prepend interactive module channels html to select_chanel_dialog radio buttons
            $.each($('div[module="interactive"]').find('.interactive_channel'), function(i, channel){
                var channelName = $(channel).attr('id');
                $(_this.parentElement).find('.select_chanel_dialog>h4')
                    .after('<label><input type="radio" name="channel" value="'+channelName+'"><i>'+channelName+'</i></label><br>');
            });

            _this.loadEvents();
        });
    };

    MonitoringTabsModule.prototype.remove = function() {
        var _this = this;
        $(_this.parentElement).unbind();
        $(_this.parentElement).remove();
        $(_this.parentElement).find("*").addBack().unbind();
        $(_this.parentElement).find("*").addBack().remove();

        removeObject(_this);
        removeObject(this);
    };

    MonitoringTabsModule.prototype.loadEvents = function() {
        var _this = this;

        $(_this.parentElement).find('.select_chanel_dialog>button').on('click', function(e){
            var channelName = $(_this.parentElement).find(".select_chanel_dialog input:radio[name=channel]:checked").val();

            _this.addMonitoringModule(channelName);
            $(_this.parentElement).find('.select_chanel_dialog').hide();
        });

        $('#monitoring_tabs_add_module_button').on('click', function(e){
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
        $(monitoringParent).find('.monitoring_tabs_remove_module_button').on('click', function(e){
            module.remove();
        });
        
        
        $(_this.parentElement).find('div[module="monitoring"]').last().after(monitoringParent);
    };

    return MonitoringTabsModule;
}());