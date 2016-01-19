var InteractiveModule = (function() {
	function InteractiveModule (parentElement) {
		this.name = $(parentElement).attr('module');
		this.path = './modules/' + this.name + '/';
		this.parentElement = parentElement;
		this.loadCss();
		this.render();
	}

	InteractiveModule.prototype.loadCss = function() {
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

	InteractiveModule.prototype.render = function(callback) {
	    var _this = this;

	    // load module html
	    $.get(_this.path + 'index.html', function(htmlData) {
	        $(_this.parentElement).append(htmlData);
	        _this.loadEvents();
	    });
	};

	InteractiveModule.prototype.remove = function() {
	    var _this = this;
	    $(_this.parentElement).unbind();
	    $(_this.parentElement).remove();
	    $(_this.parentElement).find("*").addBack().unbind();
	    $(_this.parentElement).find("*").addBack().remove();

	    removeObject(_this);
	    removeObject(this);
	};

	InteractiveModule.prototype.loadEvents = function() {
		var _this = this;

		// info channel events
		$(_this.parentElement).find('.interactive_channel').each(function(i, channelElement){
			var channelName = $(channelElement).attr('id');

			// register module to info-channel 
			infoChannelService.connect(channelName, _this, function(message){
	            $(_this.parentElement).find('.interactive_channel[id="'+channelName+'"] input').val(message);
	        });

			// load broadcast event
			$(channelElement).find('button').on('click', function(e){
				var message = $(channelElement).find('input').val();
				infoChannelService.broadcast(channelName, message);
			});
		});
	};

	return InteractiveModule;
}());
