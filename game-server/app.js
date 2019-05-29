var pomelo = require('pomelo');
var routeUtil = require("./app/util/routeUtil"); 

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game-server');



// app configuration
// app.configure('production|development', 'connector', function(){
app.configure('production|development',  function(){
//add chat
app.route("chat",routeUtil.chat);

  app.set('connectorConfig',
    {
      // connector : pomelo.connectors.hybridconnector,
      connector : pomelo.connectors.sioconnector,
      // 'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
      transports : ['websocket', 'polling'],
      heartbeats : true,
      closeTimeout : 60 * 1000,
      heartbeatTimeout : 60 * 1000,
      heartbeatInterval : 25 * 1000
    });

    //过滤器，暂时先不要了
    // app.filter(pomelo.timeout());
});

// start app 
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
