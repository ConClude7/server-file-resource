import { UserId } from "../config/reqStrings";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import consoleLog from "./console-log";
import { sendErrorRes } from "../common/reponse";
import { resCodeTokenError } from "../enum/code-error";
import mongoose from "mongoose";

/// token密钥（用于加密和解密）
export const tokenSecretKey = "token_secret";

export const tokenUnlessPath: string[] = [
  "/api/user/register",
  "/api/user/login",
  "/api/user/logout",
];

/* 
使用json_web_token工具进行签发token
*/
export const signToken = (_id: string | mongoose.Types.ObjectId): string => {
  const token = jwt.sign({ _id }, tokenSecretKey, {
    // 设置token失效时间，1天
    expiresIn: "1d",
  });
  consoleLog("🖊️签发Token", { token: token });
  return token;
};

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const pathResult = tokenUnlessPath.map((path) => req.url.includes(path));
  if (pathResult.includes(true)) {
    next();
    return;
  }

  // const token = req.headers["file-token"];
  const token = req.headers.authorization ?? req.query.token;
  consoleLog("🧐用户Token", { token: token });
  if (!token) {
    res.statusCode = resCodeTokenError;
    sendErrorRes(res, "Token为空");
    consoleLog("用户Header", req.headers);
    return;
  }
  const compressToken = String(token);
  jwt.verify(compressToken, tokenSecretKey, (err, decoded) => {
    if (err) {
      res.statusCode = resCodeTokenError;
      const errMessage: string = err.message.includes("expired")
        ? "Token过期⏰"
        : "Token无效❌";
      sendErrorRes(res, errMessage);
      return;
    }
    const userId: string = (decoded as any)._id;
    req.headers[UserId] = `${userId}`;
    next();
  });
};
