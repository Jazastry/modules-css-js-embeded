var HelloModule = (function() {
	function HelloModule (parentElement) {
		this.name = $(parentElement).attr('module');
        this.path = './modules/' + this.name + '/';
        this.parentElement = parentElement;
        this.loadCss();
        this.render();
	}

	// load module css
	HelloModule.prototype.loadCss = function() {
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

	HelloModule.prototype.render = function() {
	    var _this = this;

	    // load module html
	    $.get(_this.path + 'index.html', function(htmlData) {
	        $(_this.parentElement).append(htmlData);
	    });
	};

	HelloModule.prototype.remove = function() {
	    var _this = this;
	    $(_this.parentElement).unbind();
	    $(_this.parentElement).remove();
	    $(_this.parentElement).find("*").addBack().unbind();
	    $(_this.parentElement).find("*").addBack().remove();

	    removeObject(_this);
	    removeObject(this);
	};

	return HelloModule;
}());