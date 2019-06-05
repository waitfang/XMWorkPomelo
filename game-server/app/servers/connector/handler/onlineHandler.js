module.exports = function(app) {
    return new Handler(app);
  };
  
  var Handler = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
  };

Handler.prototype.online  = function(msg, session, next){
  var self = this;  
  var rid = session.get('rid'); 
  if(rid==null || rid=="undefined") rid = "0"; //没有分配房间，都是预设房间号0
  var uid = msg.username + '*' + rid

  session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
			if(err) {
					console.error('set rid for session service failed! error is : %j', err.stack);
			}
  });
  session.on('closed', onUserLeave.bind(null, self.app));

  var uses = this.app.rpc.chat.chatRemote.getOnline(session, uid,self.app.get('serverId'),rid,true,function(users){
      next(null, {
        msg:users
    });
  });
 
} 


/**
* User log out handler
*
* @param {Object} app current application
* @param {Object} session current session object
*
*/
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
			return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
