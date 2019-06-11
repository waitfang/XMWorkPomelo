var objtxtRoom= "#txtRoom"; //房间号
var objtxtUserId= "#txtUserId";//人员  
var time = getNowFormatDate();  

$(function(){   
    //测试链接
    $("#butshow").click(function() { 
        show();
    });

    $("#butLogin").click(function() {
        ActionLogin();
    });

    //初始化游戏页面
    $("#butGame").click(function() {
      ActionGame();
    });
    //进入特定房间
    $("#btnSendCard").click(function(){ 
      HandlerAddRoom();   
    });

    $("#butLeave").click(function() {
      disconnect("#pnlLogin","#pnlChat");
    });

    $("#btnSend").click(function(){
      sendUser();
    });
    controleHidOrShow(PageAction.index);
})

show = function(){
    params ={};
    params.action=  PageAction.show;
    params.route =  HandlerEnum.gateHandler_queryEntry;   //  gate  route
    params.rid   =  $(objtxtRoom).val();
    params.uid   =  $(objtxtUserId).val();  // 用来请求获取 connector 的ip，port
    pomeloinit(params);
}

//回调函数
BackHardler = function(params,data){   
    //测试链接成功即可，不用处理后面逻辑 
    pomelo.disconnect(); 
    if(params.action==PageAction.show && data.code === 200) {                
        alert(data.msg);
        return false;
    } 
} 

//login
ActionLogin =function(){
    var txtRoom = $(objtxtRoom).val();
    var txtUserId = $(objtxtUserId).val(); 
    params ={};
    params.action= PageAction.Login;
    params.route  = HandlerEnum.gateHandler_queryEntry;   //  gate  route
    params.rid   =  $(objtxtRoom).val();
    params.uid   =  $(objtxtUserId).val();  // 用来请求获取 connector 的ip，port
    //query entry of connection
    queryEntry(params, function(host, port) {   
        pomelo.init({
            host: host,
            port: port,
            log: true
        }, function() {  
            params.route = HandlerEnum.connector_entryHandler_enter;//请求获取 connector 的ip，port
            pomelo.request(params.route, {
                username: params.uid,
                rid: params.rid
            }, function(data) { 
                if(data.error) {
                    alert(data.error);
                    return;
                }  
                controleHidOrShow(PageAction.ActionLogin);
                // window.location.href = 'views/gameRoom.html?uid='+params.uid+"&rid="+params.rid+"&port="+port;
                //加载当前聊天室 已在线用户列表 
                $.each(data.users, function(i, item){    
                        addUser(item,"login"+i);
                });  

            });
        });
    });
}


controleHidOrShow=function(objflag){
  switch(objflag){
    case PageAction.ActionLogin:
        $('#pnlLogin').hide();
        $('#pnlChat').show(); 
        $('#spUserName').text(params.uid); //登陆账号和房间信息
        $('#spRoomId').text(params.rid); 
        break;
    case PageAction.game:
        $('#gamePlay').show(); 
        $('#pnlLogin').hide();
        $('#pnlChat').hide(); 
        // $('#pnlChat')[0].style.display = 'none';  
        break;
    case PageAction.index:
        $('#pnlLogin').show(); 
        $('#pnlChat').hide(); 
        $('#gamePlay').hide(); 
      break;
  }
}

 
  //user登入时，add 提醒，用户列表
  addUser = function(user,flage){ 
    var  txtMessage = $('#txtMessage');
    var selUserList =  $('#selUserList');  
    var addtMessage ="Y";
    //不想登陆人员看到其他人的信息
    if(flage.indexOf("login") != -1 && $(objtxtUserId).val() != user){ 
        addtMessage ="N";
    } 
    if(addtMessage=="Y") //预设是所有的人都要有上线提醒
      txtMessage.append('<span style="color:green;">[上线提醒]:欢迎 ' + user + ' 加入聊天室<span><br/>'); 
    //添加到用户列表
    selUserList.append('<option value="' + user + '">' + user + '</option>'); 
  }

  //离开
  removeUser = function(user){
    $('#txtMessage').append('<span style="color:green;">[离线提醒]: ' + user + ' 离开聊天室<span><br/>'); 
    //从用户列表移除
    $('#selUserList option[value="' + user + '"]').remove();

    $("#spUserOnlineCount").text($("#spUserOnlineCount").text()*1-1);    
  }

  //发送消息
  addMessage = function(from, target, content){
    var name = (params.target == '*' ? '所有人' : params.target);
    if(from !=params.uid) //发送者已经写过一次了，不需要重复写
      $("#txtMessage").append('<span style="color:blue;">[' + time +'][' + from + '] 对 [' +  target + '] 说： ' + content + '<span><br/>');
  }

  //发送消息
  sendUser = function(){
    var txtSendMessage = $("#txtSendMessage").val();//发送消息
    var toUser = $("#selUserList").val();//消息对象，消息发送给谁
    var fromUser = params.uid;//消息发送者
    params.route =  HandlerEnum.chatHandler_send;   //  chat  route
    params.content = txtSendMessage;
    params.from  = fromUser;
    params.target = toUser;

    if(txtSendMessage.length == 0){
      alert('消息不能为空!');
      return;
    }
    
    pomelo.request(params.route,params,function(data){
      $("#txtSendMessage").val("");
      // if(params.from == data.from) {
        var name = (params.target == '*' ? '所有人' : params.target);
        time = getNowFormatDate();   
        $("#txtMessage").append('<span style="color:blue;">[' + time +'][' + params.from + '] 对 [' +  name + '] 说： ' + params.content + '<span><br/>');
    // }
    })
  }
 
