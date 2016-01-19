var MonitoringModule = (function() {
	function MonitoringModule (parentElement, infoChannel) {
        this.name = $(parentElement).attr('module');
        this.path = './modules/' + this.name + '/';
        this.parentElement = parentElement;               
        // sets infoChannel if provided if not 'info_channel_A'
        this.infoChannel = infoChannel ? infoChannel : 'info_channel_A';    
        this.loadCss();
        this.render();
	}

	MonitoringModule.prototype.loadCss = function() {
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

	MonitoringModule.prototype.render = function() {
	    var _this = this;

	    // load module html
	    $.get(_this.path + 'index.html', function(htmlData) {
	        $(_this.parentElement).append(htmlData);
	        _this.loadModule();
	    });
	};

	MonitoringModule.prototype.remove = function() {
	    var _this = this;
	    $(_this.parentElement).unbind();
	    $(_this.parentElement).remove();
	    $(_this.parentElement).find("*").addBack().unbind();
	    $(_this.parentElement).find("*").addBack().remove();

	    removeObject(_this);
	    removeObject(this);
	};

	MonitoringModule.prototype.loadModule = function() {
	    var _this = this;
	    var channel = _this.infoChannel;

	    // load chanel name
	    $(_this.parentElement).find('.channel_name > span').html(channel);
	    $(_this.parentElement).find('.broadcast_button').attr('broadcast-channel', channel);

	    // register module to info-channel 
	    infoChannelService.connect(channel, _this, function(message){
            $(_this.parentElement).find('.info_input').val(message);
        });	    
	    
	    // load current info
	    var currentMessage = infoChannelService.getInfo(channel);
	    $(_this.parentElement).find('.info_input').val(currentMessage);

	    _this.clickEvents();
	};

	MonitoringModule.prototype.clickEvents = function() {
	    var _this = this;

	    // register broadcast 
	    $(_this.parentElement).find('.broadcast_button').on('click', function(e) {
	        var channel = _this.infoChannel;
	        var message = $(_this.parentElement).find('.info_input').val();

	        infoChannelService.broadcast(channel, message, _this);
	    });
	};

	MonitoringModule.prototype.remove = function() {
	    var _this = this;
	    infoChannelService.disconnect(_this.infoChannel, _this);
	    $(_this.parentElement).unbind();
	    $(_this.parentElement).remove();
	    $(_this.parentElement).find("*").addBack().unbind();
	    $(_this.parentElement).find("*").addBack().remove();

	    removeObject(_this);
	    removeObject(this);
	};

	return MonitoringModule;
}());
