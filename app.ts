//功能说明：启动文件，
//作者：Wait
//创建时间：2019/04/27

import express, { Request, Response, NextFunction } from 'express';  
import bodyParser from 'body-parser' 
import log4js, { levels } from 'log4js' //log4js 日志管理 
import {fsreadJsonFile,fsreadFileSync}  from  './routes/function/FunConfig';//引入配置档读取功能
import {ExpressDecrorators} from './routes/class/ExpressDecrorators';
import {UserController} from './routes/controllers/UserController';  
import {ReadFileConfig} from './routes/class/ReadFileConfig';
import  path from 'path'; 
  
let mResourceJson  = fsreadFileSync();//同步读取

let listenIP = mResourceJson.listenIP; //监听ip和端口 "localhost";
let listenPort=mResourceJson.listenPort;//8088; 
let log4jsConfigure = "public\\resource\\log4js.json";//log4js 配置文件
 
let app = express(); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

log4js.configure(log4jsConfigure)
app.use(log4js.connectLogger(log4js.getLogger("default"), { level: 'auto' }));

// view engine setup  链接到jade模板
app.set('views', path.resolve()+ '/views');
app.set('view engine', 'jade');


ExpressDecrorators.app = app;

UserController; //引用路由页

app.listen(listenPort,listenIP); 