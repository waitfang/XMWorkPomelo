var params ={};
var objtxtRoom= "#txtRoom"; //房间号
var objtxtUserId= "#txtUserId";//人员
$(function(){  
    pomeloFunction();

    $("#butshow").click(function() { 
        show();
    });

    $("#butLogin").click(function() {
        ActionLogin();
    });
})

pomeloFunction=function(){ 
    //wait message from the server.
	pomelo.on('onChat', function(data) {
		addMessage(data.from, data.target, data.msg); 
	});

	//update user list
	pomelo.on('onAdd', function(data) {
		var user = data.user; 
		addUser(user);
	});

	//update user list
	pomelo.on('onLeave', function(data) {
		var user = data.user; 
		removeUser(user);
	});


	//handle disconect message, occours when the client is disconnect with servers
	pomelo.on('disconnect', function(reason) {
		// showLogin();
	});

}

show = function(){
    params ={};
    params.action="show";
    params.route="gate.gateHandler.queryEntry";   //  gate  route
    params.rid   =  $(objtxtRoom).val();
    params.uid   =  $(objtxtUserId).val();  // 用来请求获取 connector 的ip，port
    pomeloinit(params);
}


//回调函数
BackHardler = function(params,data){   
    //测试链接成功即可，不用处理后面逻辑 
    pomelo.disconnect(); 
    if(params.action=="show" && data.code === 200) {                
        alert(data.msg);
        return false;
    } 
} 

//login
ActionLogin =function(){
    var txtRoom = $(objtxtRoom).val();
    var txtUserId = $(objtxtUserId).val(); 
    params ={};
    params.action="ActionLogin";
    params.route="gate.gateHandler.queryEntry";   //  gate  route
    params.rid   =  $(objtxtRoom).val();
    params.uid   =  $(objtxtUserId).val();  // 用来请求获取 connector 的ip，port
    //query entry of connection
    queryEntry(params, function(host, port) {  
        pomelo.init({
            host: host,
            port: port,
            log: true
        }, function() {
            params.route = "connector.entryHandler.enter";//请求获取 connector 的ip，port
            pomelo.request(params.route, {
                username: params.uid,
                rid: params.rid
            }, function(data) { 
                if(data.error) {
                    alert(data.error);
                    return;
                }  
                $('#pnlLogin').hide();
                $('#pnlChat').show(); 
                $('#spUserName').text(params.uid); //登陆账号和房间信息
                $('#spRoomId').text(params.rid);
                //加载当前聊天室 已在线用户列表
                $.each(data.users, function(i, item){                     
                    if(item != params.uid){
                        $('#selUserList').append('<option value="' + item + '">' + item + '</option>');
                    }                        
                });  

            });
        });
    });
}

  //链接成功，呼叫回调函数
  function queryEntry(params, callback) {  
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

 
