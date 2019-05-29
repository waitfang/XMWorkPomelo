module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};
 
var UserInfo =require("../../dao/UserInfo");

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry_ = function(msg, session, next) {
  next(null, {code: 200, msg: msg  + 'game server entry is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish_ = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe_ = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};

var handler = Handler.prototype;
/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.enter = function(msg, session, next) {
	var self = this;
	var rid = msg.rid;
	var uid = msg.username + '*' + rid
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
			next(null, {
					code: 500,
					error: "【"+msg.username+"】"+"在【"+msg.rid+"】已存在！"            
			});
			return;
	}

	UserInfo.UserInfo({USERNAME: msg.username});//测试DB Conn

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
			if(err) {
					console.error('set rid for session service failed! error is : %j', err.stack);
			}
	});
	session.on('closed', onUserLeave.bind(null, self.app));
 
	console.log("serverId=="+self.app.get('serverId'));
	//put user into channel
	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
			next(null, {
					users:users
			});
	});
};

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
