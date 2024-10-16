import consoleLog from "./utils/console-log";
import getLocalIPv4Address from "./utils/get-ipv4";
import TimeUtil from "./utils/timeUtil";
import appRouter from "./router/router";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { MongoManagement } from "./database/mongo";
import { sendErrorRes } from "./common/reponse";
import { ServiceTime, ServiceTimeStemp } from "./config/reqStrings";
import { checkToken } from "./utils/tokenUtil";
import FileController from "./controllers/controller-file";

// 服务器实例
const app = express();
/// 跨域
app.use(cors());
// 使用Json
app.use(express.json());
// 静态资源
app.use(express.static("src/userFiles/"));
// 时间工具
const timeUtil = new TimeUtil();
// 端口
export const serverPort = 10100;

// 启动服务器
app.listen(serverPort, () => {
  MongoManagement.mongoInit();
  console.log(`文件资源服务器_启动🎉\n${getLocalIPv4Address()}:${serverPort}`);
  console.log(`⏰启动时间:${timeUtil.getNowTimeString()}`);
});

/*
请求中间件：
将请求的时间保存在请求头（req.headers）中
方便接口处理时获得请求时间
*/
app.use((req: Request, res: Response, next) => {
  const timeUtil: TimeUtil = new TimeUtil();
  // 获取当前时间戳
  const timeStemp: number = timeUtil.getNowTimeStemp();
  // 获取当前时间（时间格式：YYYY-MM-DD HH:MM:SS）
  const timeString: string = timeUtil.getNowTimeString();
  // 设置请求头
  req.headers[ServiceTime] = timeString;
  req.headers[ServiceTimeStemp] = timeStemp.toString();
  console.log(`请求时间:${timeString}`);
  // 执行下一步
  next();
});

// 请求头中间件
app.use((req, res, next) => {
  consoleLog("📩api", req.url);
  consoleLog("🎁req.body", req.body);
  consoleLog("🪜req.params", req.params);
  next();
});

// 检查token权限
app.use(checkToken);

app.use("/api", appRouter);

// 对图片资源进行token验证
app.use("/:fileName", FileController.getFile);

/// 错误拦截
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  consoleLog("❌Error", err);
  sendErrorRes(res);
  next(err);
});
