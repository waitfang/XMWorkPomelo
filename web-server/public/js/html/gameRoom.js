/**
 * 功能说明：
 */

$(function(){
    Action.online();

})


var Action = {
    online :function(){ 
        params.Action = PageAction.GetOnline;
        params.route = HandlerEnum.gateHandler_queryEntry;
        params.uid =GetQueryString("data");//没有选定房间，查所有在线人数。
        params.rid =0; 
        queryEntry(params,function(host,port){ 
            pomelo.init({
                host: host,
                port: port,
                log: true
            }, function() {
                params.route = HandlerEnum.connector_onlineHandler; 
                pomelo.request(params.route, {
                    username: params.uid,
                    rid: params.rid
                },function(data){
                    alert(data.msg);
                    });
                }
            ) 
        })
    }
}   
 