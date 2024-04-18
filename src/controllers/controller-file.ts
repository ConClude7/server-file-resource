import { Request, Response } from "express";
import consoleLog from "../utils/console-log";
import { sendErrorRes, sendSuccessRes } from "./common/reponse";
import getLocalIPv4Address from "../utils/get-ipv4";
import { serverPort } from "../main";

export default class FileController {
  private static getUrl = (file: Express.Multer.File): string => {
    const fileUrl = `${getLocalIPv4Address()}:${serverPort}/${file.filename}`;
    return fileUrl;
  };

  public static uploadOne = (req: Request, res: Response) => {
    if (!req.file) {
      sendErrorRes(res, "未上传图片");
      return;
    }
    consoleLog("📃上传单文件", req.file);
    const fileUrl = this.getUrl(req.file);
    sendSuccessRes(res, { url: fileUrl });
  };

  public static uploadMany = (req: Request, res: Response) => {
    if (!req.files) {
      sendErrorRes(res, "未上传图片");
      return;
    }
    consoleLog("📁上传多文件", req.files);
    const fileUrlList = (req.files as Array<Express.Multer.File>).map(
      (fileItem) => this.getUrl(fileItem)
    );
    sendSuccessRes(res, { urlList: fileUrlList });
  };
}
