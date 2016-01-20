function MonitoringModule(parentElement, infoChannel) {
    this.name = $(parentElement).attr('module');
    this.path = './modules/' + this.name + '/';
    this.parentElement = parentElement;
    // sets infoChannel if provided, if defaults to 'info_channel_A'
    this.infoChannel = infoChannel ? infoChannel : 'info_channel_A';
    this.prepare();
}

MonitoringModule.prototype.prepare = function() {
    var _this = this;

    _this.loadModule();
};

MonitoringModule.prototype.remove = function() {
    var _this = this;
    $(_this.parentElement).children().unbind();
    $(_this.parentElement).children().remove();
    $(_this.parentElement).children().find("*").addBack().unbind();
    $(_this.parentElement).children().find("*").addBack().remove();

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
    infoChannelService.connect(channel, _this, function(message) {
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
