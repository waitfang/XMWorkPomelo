"use strict";
//功能说明：启动文件，
//作者：Wait
//创建时间：2019/04/27
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FunConfig_1 = require("./routes/function/FunConfig"); //引入配置档读取功能
const ExpressDecrorators_1 = require("./routes/class/ExpressDecrorators");
const UserController_1 = require("./routes/controllers/UserController");
const ReadFileConfig_1 = require("./routes/class/ReadFileConfig");
// fsreadJsonFile();//异步读取json配置
let mPromise = ReadFileConfig_1.ReadFileConfig.ReadFileConfig();
mPromise.then((data) => {
    let mResourceJson = data;
});
let mResourceJson = FunConfig_1.fsreadFileSync(); //同步读取
let listenIP = mResourceJson.listenIP; //监听ip和端口 "localhost";
let listenPort = mResourceJson.listenPort; //8088; 
let log4jsConfigure = "public\\resource\\log4js.json"; //log4js 配置文件
let app = express_1.default();
// log4js.configure(log4jsConfigure)
// app.use(log4js.connectLogger(log4js.getLogger("default"), { level: 'auto' }));
ExpressDecrorators_1.ExpressDecrorators.app = app;
UserController_1.UserController; //引用路由页
app.listen(listenPort, listenIP);
//# sourceMappingURL=app.js.map