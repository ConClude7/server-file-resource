import { Router } from "express";
import FileController from "../controllers/controller-file";
import multer from "multer";
import TimeUtil from "../utils/timeUtil";

const fileRouter = Router();
const timeUtil = new TimeUtil();

// 文件保存配置
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "src/dist/");
  },
  filename(req, file, cb) {
    const fileName =
      req.body.fileName ?? `${timeUtil.getNowTimeStemp()}-${file.originalname}`;
    cb(null, fileName);
  },
});

// 文件中间件实例 文件存放路径
const appUpload = multer({ storage });

fileRouter.post(
  "/uploadOne",
  appUpload.single("file"),
  FileController.uploadOne
);
fileRouter.post(
  "/uploadMany",
  appUpload.array("files", 9),
  FileController.uploadMany
);

export default fileRouter;
