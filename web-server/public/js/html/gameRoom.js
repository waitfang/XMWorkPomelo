/**
 * 功能说明：游戏相关，发牌，出牌，输赢。
 */ 
  
 //初始化游戏页面
ActionGame = function(){
    controleHidOrShow(PageAction.game);
    gameRoom.HandlerOnline();

    gameRoom.GameBack(cardValueEnum);
  }
 
  
var gameRoom = { 
    //查在线人数，已经人员额度。。。
    HandlerOnline:function(){ 
        params.route = HandlerEnum.chatHandler_Useronline;//请求获取 connector 的ip，port 
        pomelo.request(params.route, {
            username: params.uid,
            rid: params.rid
        }, function(data) {  
            onlineUser(data.users,"online"); 
            // gameRoom.GameBack(data);
        })  
    }
    //显示牌局背面
    ,GameBack:function(data){ 
        $('#gameroom_tmpl2').tmpl(data).appendTo('#CardBankList'); 
    } 
} 

//进入房间，发牌。
HandlerAddRoom =function(){   
    params ={};
    params.action= PageAction.Login;
    params.route  = HandlerEnum.gateHandler_queryEntry;   //  gate  route
    params.rid   =  $('#joinRoom').val();
    params.uid   =  $(objtxtUserId).val();  // 用来请求获取 connector 的ip，port 
    controleHidOrShow(PageAction.game); 
    //query enterRoom of connection    
    params.route = HandlerEnum.connector_entryHandler_enterRoom;//请求获取 connector 的ip，port 
    pomelo.request(params.route, {
        username: params.uid,
        rid: params.rid
    }, function(data) { 
        if(data.error) {
            alert(data.error); 
        }   
        $('#myCardChild').empty();;
        $('#myGameRoom_tmpl').tmpl(data).appendTo('#myCardChild'); 
        controleHidOrShow(PageAction.game); 
        return false;
    }); 
    return false;
}

//查在线人数。。。
onlineUser = function(user,flage){  
    $("#spUserOnlineCount").text(user.length);    
}
 