function MonitoringModule(parentElement, infoChannel) {
    this.name = $(parentElement).attr('module');
    this.path = './modules/' + this.name + '/';
    this.parentElement = parentElement;
    // sets infoChannel if provided, if defaults to 'info_channel_A'
    this.infoChannel = infoChannel ? infoChannel : 'info_channel_A';
    this.loadModule();
}

MonitoringModule.prototype.connect = function(channelName) {
    var _this = this;
    var channel = channelName ? channelName : _this.infoChannel;
    _this.infoChannel = channel;

    // register module to info-channel 
    infoChannelService.connect(_this.infoChannel, _this, function(message) {
        $(_this.parentElement).find('.info_input').val(message);
    });
};

MonitoringModule.prototype.loadModule = function() {
    var _this = this;

    _this.connect();
    _this.loadChannelInfo();
    _this.loadEvents();
};

MonitoringModule.prototype.loadChannelInfo = function() {
    var _this = this;
    var channel = _this.infoChannel;

    // load chanel name
    $(_this.parentElement).find('.channel_name > span').html(channel);
    $(_this.parentElement).find('.broadcast_button').attr('broadcast-channel', channel);

    // load current info
    var currentMessage = infoChannelService.getInfo(channel);
    $(_this.parentElement).find('.info_input').val(currentMessage);
};

MonitoringModule.prototype.loadEvents = function() {
    var _this = this;

    // register broadcast on click event
    $(_this.parentElement).find('.broadcast_button').on('click', function(e) {
        var channel = _this.infoChannel;
        var message = $(_this.parentElement).find('.info_input').val();

        infoChannelService.broadcast(channel, message, _this);
    });
};

MonitoringModule.prototype.remove = function() {
    var _this = this;

    // disconnect from info channel
    infoChannelService.disconnect(_this.infoChannel, _this);

    // unbind all attached events and remove all HTML elements
    $(_this.parentElement).unbind();
    $(_this.parentElement).remove();
    $(_this.parentElement).find("*").addBack().unbind();
    $(_this.parentElement).find("*").addBack().remove();

    // remove all function instances
    removeObject(_this);
};
