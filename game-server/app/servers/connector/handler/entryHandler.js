var UserInfo =require("../../dao/UserInfo"); 
var Card = require('../../../util/Card'); 
var Token = require('../../../util/Token');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
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

	Token.CreatToken(uid);//创建token；

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


//进入新房间，带发牌
handler.enterRoom = function(msg, session, next) {
	var self = this;
	var rid = msg.rid;
	var uid = msg.username + '*' + rid
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		getCard(next);//人员存在，重新发牌就可以了
		return;
	}

	UserInfo.UserInfo({USERNAME: msg.username});//测试DB Conn

	session.bind(uid);
	session.set('ridRoom', rid);
	session.push('ridRoom', function(err) {
			if(err) {
					console.error('set rid for session service failed! error is : %j', err.stack);
			}
	});
	session.on('closed', onUserLeaveRoom.bind(null, self.app));  
	//put user into channel
	self.app.rpc.chat.chatRemote.AddRoom(session, uid, self.app.get('serverId'), rid, true,getCard(next));
};


var onUserLeaveRoom = function(app, session) {
	if(!session || !session.uid) {
			return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('ridRoom'), null);
};

//返回发的牌 
var getCard = function(next) {
	var Cards =Card.getCard();
	console.log("Cards=="+Cards);
		next(null, {
			Cards:Cards
		});
};