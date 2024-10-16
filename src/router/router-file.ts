import FileController from "../controllers/controller-file";
import { Router } from "express";
import multer from "multer";
import TimeUtil from "../utils/timeUtil";
import { getHeaderUserId } from "../utils/reqUtil";
import fs from "fs";

const fileRouter = Router();
const timeUtil = new TimeUtil();

fileRouter.delete("/", FileController.deleteOne);
fileRouter.post("/list", FileController.list);

// 文件保存配置
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `src/userFiles/${getHeaderUserId(req)}`;
    const sharpDir = `src/userFiles/${getHeaderUserId(req)}_sharp`;
    // 检查路径是否存在，如果不存在则创建
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // 递归创建路径
    }
    if (!fs.existsSync(sharpDir)) {
      fs.mkdirSync(sharpDir, { recursive: true }); // 递归创建路径
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    const fileName =
      req.body.fileName ?? `${timeUtil.getNowTimeStemp()}-${file.originalname}`;
    cb(null, fileName);
  },
});

// 文件中间件实例 文件存放路径
export const appUpload = multer({ storage });

fileRouter.put(
  "/uploadOne",
  appUpload.single("file"),
  FileController.uploadOne
);
fileRouter.put(
  "/uploadMany",
  appUpload.array("files", 9),
  FileController.uploadMany
);

export default fileRouter;
