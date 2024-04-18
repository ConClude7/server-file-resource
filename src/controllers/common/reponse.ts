import { resCodeError } from "../../enum/code-error";
import { Response } from "express";
import consoleLog from "../../utils/console-log";

interface ApiResponse {
  success: boolean;
  code: number;
  message?: string;
  error?: string;
  data?: any;
}

export const sendReponse = (
  res: Response,
  success: boolean,
  message?: string,
  data?: any
) => {
  const response: ApiResponse = { success, code: res.statusCode };

  if (data) {
    response.data = data;
  } else {
    response.data = {};
  }
  if (message) {
    response.message = message;
    if (!success) response.error = message;
  }
  response.code = res.statusCode;
  res.statusCode = 200;

  consoleLog("返回数据📩", response);
  res.json(response);
};

export const sendSuccessRes = (res: Response, data?: any) => {
  sendReponse(res, true, "成功", data);
};

export const sendErrorRes = (res: Response, message?: string) => {
  if (res.statusCode == 200) res.statusCode = resCodeError;
  sendReponse(res, false, message);
};
