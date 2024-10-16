import { User } from "../models/user/user";
import { Request } from "express";
import { Schema } from "mongoose";
import consoleLog from "./console-log";
import { ServiceTime, ServiceTimeStemp, UserId } from "../config/reqStrings";

/// 获取当前时间戳
export const getServiceTimeStemp = (req: Request) => {
  const timeStempString: string = `${req.headers[ServiceTimeStemp]}`;
  const timeStemp: number = parseFloat(timeStempString);
  return timeStemp;
};

/// 获取当前格式
export const getServiceTimeString = (req: Request) => {
  const timeString: string = `${req.headers[ServiceTime]}`;
  return timeString;
};

/// 通过token中间件设置的memberId
export const getHeaderUserId = (req: Request): Schema.Types.ObjectId => {
  const userIdString: string = `${req.headers[UserId]}`;
  const userId = userIdString as unknown as Schema.Types.ObjectId;
  consoleLog(`访问用户Id`, userId);
  return userId;
};

/// 获取url头信息
/// key需要去 @typings/express.d.ts 添加
export const getHeader = (req: Request, key: string): string | null => {
  const value: string | null = `${req.headers[key]}`;
  consoleLog(`获取Header数据`, { key: value });
  return value;
};

/// 格式化分页请求头
export const getPageQuery = (req: Request): PageQuery => {
  const pageIndex: number = parseFloat(`${req.body.pageIndex}`) - 1;
  const pageSize: number = parseFloat(`${req.body.pageSize}`);
  const skipCount: number = pageIndex * pageSize;

  const pageQuery: PageQuery = { total: 0, pageIndex, pageSize, skipCount };
  return pageQuery;
};

export type PageQuery = {
  total: number;
  pageIndex: number;
  pageSize: number;
  skipCount: number;
};
