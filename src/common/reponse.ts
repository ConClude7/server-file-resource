import { resCodeError, resCodeTokenError } from "../enum/code-error";
import { Response } from "express";
import consoleLog from "../utils/console-log";
import { PageQuery } from "../utils/reqUtil";

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
  if (![resCodeTokenError].includes(res.statusCode)) {
    res.statusCode = 200;
  }

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

/// 分页查询-返回
export const sendSuccessPageRes = <T>(
  res: Response,
  pageQuery: PageQuery,
  data: T[]
) => {
  // 因为查询时多查询了一长度，所以要减去;
  const haveNextPage = data.length > pageQuery.pageSize;
  if (haveNextPage) data.pop();
  sendReponse(res, true, "成功", {
    haveNextPage: haveNextPage,
    pageIndex: pageQuery.pageIndex,
    pageSize: pageQuery.pageSize,
    total: pageQuery.total,
    list: data,
  });
};
