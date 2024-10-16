import { NextFunction, Request, Response } from "express";
import consoleLog from "../utils/console-log";
import getLocalIPv4Address from "../utils/get-ipv4";
import { serverPort } from "../main";
import { ServerFile } from "../models/serverFile/serverFile";
import {
  getHeaderUserId,
  getPageQuery,
  getServiceTimeString,
} from "../utils/reqUtil";
import {
  sendErrorRes,
  sendSuccessPageRes,
  sendSuccessRes,
} from "../common/reponse";
import { findPageData } from "../database/pageQueryTool";
import sharp from "sharp";

export default class FileController {
  private static populate: string[] = ["uploader"];

  private static getUrl = (
    file?: Express.Multer.File,
    imageName?: string
  ): string => {
    const fileUrl = `http://${getLocalIPv4Address()}:${serverPort}/${
      file?.filename ?? imageName
    }`;
    return fileUrl;
  };

  public static uploadOne = async (req: Request, res: Response) => {
    if (!req.file) {
      sendErrorRes(res, "未上传图片");
      return;
    }
    const compressFile = req.file as Express.Multer.File;
    consoleLog("📃上传单文件", compressFile);
    const createTime = getServiceTimeString(req);
    const userId = getHeaderUserId(req);
    const fileUrl = this.getUrl(compressFile);
    const serverFile = await ServerFile.create({
      path: compressFile.path,
      fileName: compressFile.filename,
      fileSize: compressFile.size,
      createTime,
      uploader: userId,
    });
    sendSuccessRes(res, { fileName: serverFile.fileName });
    const sharpPath = `src/userFiles/${userId}_sharp/${compressFile.filename}`;
    await serverFile.updateOne({ sharpPath });
    sharp(compressFile.path)
      .resize({ width: 1024 })
      .toFile(sharpPath, (err) => {
        if (err) {
          consoleLog("压缩图片时失败", err);
          return;
        }
      });
  };

  public static uploadMany = async (req: Request, res: Response) => {
    if (!req.files) {
      sendErrorRes(res, "未上传图片");
      return;
    }
    consoleLog("📁上传多文件", req.files);
    const compressFiles = req.files as Array<Express.Multer.File>;
    const userId = getHeaderUserId(req);
    const fileUrlList = compressFiles.map(async (fileItem) => {
      const createTime = getServiceTimeString(req);
      const fileUrl = this.getUrl(fileItem);

      const serverFile = await ServerFile.create({
        path: fileItem.path,
        fileName: fileItem.filename,
        fileSize: fileItem.size,
        createTime,
        uploader: userId,
      });
      const sharpPath = `src/userFiles/${userId}_sharp/${fileItem.filename}`;
      sharp(fileItem.path)
        .jpeg({ quality: 10 })
        .toFile(sharpPath, (err) => {
          if (err) {
            consoleLog("压缩图片时失败", err);
            return;
          }
          serverFile.updateOne({ sharpPath });
        });
      return fileUrl;
    });

    sendSuccessRes(res, { urlList: fileUrlList });
  };

  public static getFile = async (req: Request, res: Response) => {
    const file = await ServerFile.findOne({ fileName: req.params.fileName });
    if (file) {
      res.sendFile(file.sharpPath ?? file.path, { root: "." });
      return;
    }
    sendErrorRes(res, "未找到此资源");
  };

  // 删除文件
  public static deleteOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fileId = `${req.query.id}`;
      const serverFile = await ServerFile.findByIdAndDelete(fileId);
      if (!serverFile) {
        sendErrorRes(res, "无此文件");
        return;
      }
      sendSuccessRes(res);
    } catch (error) {
      next(error);
    }
  };

  // 获取文件列表
  public static list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const search = `${req.body.search}`;
      const reg = new RegExp(search, "i");

      const filter: any = {
        $or: [{ code: reg }, { fileName: reg }, { createTime: reg }],
      };
      const pageQuery = getPageQuery(req);
      const printHistoryList = await findPageData(pageQuery, ServerFile, {
        filter,
        populate: this.populate,
        sort: { createTime: -1 },
      });

      sendSuccessPageRes(res, pageQuery, printHistoryList);
    } catch (error) {
      next(error);
    }
  };
}
