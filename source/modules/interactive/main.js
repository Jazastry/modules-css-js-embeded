function InteractiveModule(parentElement) {
    this.name = $(parentElement).attr('module');
    this.path = './modules/' + this.name + '/';
    this.parentElement = parentElement;
    this.prepare();
}

InteractiveModule.prototype.prepare = function() {
    var _this = this;

    _this.loadEvents();
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
    $(_this.parentElement).find('.interactive_channel').each(function(i, channelElement) {
        var channelName = $(channelElement).attr('id');

        // register module to info-channel 
        infoChannelService.connect(channelName, _this, function(message) {
            $(_this.parentElement).find('.interactive_channel[id="' + channelName + '"] input').val(message);
        });

        // load broadcast event
        $(channelElement).find('button').on('click', function(e) {
            var message = $(channelElement).find('input').val();
            infoChannelService.broadcast(channelName, message);
        });
    });
};
