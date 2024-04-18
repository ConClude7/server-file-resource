import consoleLog from "./utils/console-log";
import getLocalIPv4Address from "./utils/get-ipv4";
import TimeUtil from "./utils/timeUtil";
import appRouter from "./router";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { sendErrorRes } from "./controllers/common/reponse";

// 服务器实例
const app = express();
/// 跨域
app.use(cors());
// 使用Json
app.use(express.json());
// 静态资源
app.use(express.static("src/dist/"));
// 时间工具
const timeUtil = new TimeUtil();
// 端口
export const serverPort = 10100;

// 启动服务器
app.listen(serverPort, () => {
  console.log(`文件资源服务器_启动🎉\n${getLocalIPv4Address()}:${serverPort}`);
  console.log(`⏰启动时间:${timeUtil.getNowTimeString()}`);
});

// 请求头中间件
app.use((req, res, next) => {
  consoleLog("📩api", req.url);
  consoleLog("🎁req.body", req.body);
  consoleLog("🪜req.params", req.params);
  next();
});

app.use("", appRouter);

/// 错误拦截
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  consoleLog("❌Error", err);
  sendErrorRes(res);
  next(err);
});
