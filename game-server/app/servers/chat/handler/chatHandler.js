var chatRemote = require('../remote/chatRemote');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.send = function(msg, session, next) {
    var rid = session.get('rid');
    var username = session.uid.split('*')[0];
    var channelService = this.app.get('channelService');
    console.log("rid="+rid+"=username=" + username +"=="+channelService);
    var param = {
        route: 'onChat',
        msg: msg.content,
        from: username,
        target: msg.target,
        time: msg.time
    };
    channel = channelService.getChannel(rid, false);

    //the target is all users
    if(msg.target == '*') {
        channel.pushMessage(param);
    }
    //the target is specific user
    else {
        var tuid = msg.target + '*' + rid;
        var tsid = channel.getMember(tuid)['sid'];
        channelService.pushMessageByUids(param, [{
            uid: tuid,
            sid: tsid
        }]);
    }
    next(null, {
        route: msg.route
    });
};


handler.Useronline = function(msg,session,next){
    var users = [];
    var rid = session.get('rid');
    var username = session.uid.split('@')[0];
    var channelService  = this.app.get('channelService');
    channel = channelService.getChannel(rid, false);
    if( !! channel) {
        users = channel.getMembers();
    }
    for(var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    var param={
        route:'online',
        users :users
    }
    
    console.log("users***************="+users);
    channel.pushMessage(param);
    next(null, {
        route: msg.route,
        users :users
    });
}