var dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function(msg, session, next) {

    // next(null, {code: 500}); 
    var uid = msg.uid;
    console.log("uid="+ uid+ " uid="+!uid);
    // if(!uid) {
    //     next(null, {
    //         code: 500,
    //         msg: "gate 链接成功！"
    //     });
    //     return;
    // }
    // get all connectors 
    var connectors = this.app.getServersByType('connector');
    console.log("connectors==="+connectors + "connector="+connectors.length );
	
    if(connectors==null || connectors=="undefined" || connectors==""){
        next(null, {
            code: 500,
            msg: "gate connector undefined"
        });
        return;
    }
    
	
	
	if(!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// select connector
    var res = dispatcher.dispatch(uid, connectors);
    console.log("res host="+res.host +"res clientPort="+res.clientPort);
	next(null, {
        code: 200,
        msg: "【gate】 获取 【connector】 成功!",
		host: res.host,
		port: res.clientPort
	});
}; 