 
  var pomelo = window.pomelo;
  var host = "127.0.0.1";
  var port = "3010";//connector 服务器
  port = "5150"; //gate 服务器
 
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


 