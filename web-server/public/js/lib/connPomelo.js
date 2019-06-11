  var pomelo = window.pomelo;
  var host = "127.0.0.1";
  var port = "3010";//connector 服务器
  var port = "5150"; //gate 服务器
  var params ={};   

  var pomeloinit = function(params){ 
    pomelo.init({
      host: host,
      port: port,
      log: true
    }, function(){    
      pomelo.request(params.route,params,function(data) { 
          BackHardler(params,data);
      });
    });
  } 

  //server 路由
  var HandlerEnum = {
    gateHandler_queryEntry : "gate.gateHandler.queryEntry",
    connector_entryHandler_enter : "connector.entryHandler.enter" ,
    connector_entryHandler_enterRoom : "connector.entryHandler.enterRoom" ,
    connector_onlineHandler: "connector.onlineHandler.online" ,
    chatHandler_send : "chat.chatHandler.send",
    chatHandler_Useronline : "chat.chatHandler.Useronline"
  }

  //Page action
  var PageAction = {
    show:"show",
    Login:"ActionLogin",
    index:"index",
    GetOnline :"GetOnline",
    game :"game"
  }

  //断开链接
  var disconnect=function(pnlLogin,pnlChat){  
    //handle disconect message, occours when the client is disconnect with servers
    pomelo.disconnect(); 
    $(pnlLogin).show();
    $(pnlChat).hide(); 
    $('#txtMessage').val(''); 
    $('#selUserList').empty();
    $('#selUserList').append('<option value="*">所有人</option>'); 
  }
   //wait message from the server.
	pomelo.on('onChat', function(data) {
		addMessage(data.from, data.target, data.msg); 
	});

	//update user list
	pomelo.on('onAdd', function(data) {
		var user = data.user; 
		addUser(user,"onAdd");
  });
  
  pomelo.on('online', function(data) {
		var user = data.users; 
		onlineUser(user,"online");
  });
  

	//update user list
	pomelo.on('onLeave', function(data) {
		var user = data.user; 
		removeUser(user);
  });
  
  pomelo.on('disconnect', function(reason) {
    // showLogin();
    $('#pnlLogin').show();
    $('#pnlChat').hide();     
  });

  
  //链接成功，呼叫回调函数
  var queryEntry  = function(params, callback) {    
    pomelo.init({
      host: host,
      port: port,
      log: true
    }, function() {
      pomelo.request(params.route, {
        uid: params.uid
      }, function(data) {
        pomelo.disconnect(); 
        if(data.code === 500) {
          alert(data.msg);
          return;
        } 
        callback(data.host, data.port);
      });
    });
  };

//获取参数
var GetQueryString = function(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//系统时间
var getNowFormatDate = function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}




 