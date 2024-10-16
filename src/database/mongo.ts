import { Connection } from "mongoose";
import mongoose from "mongoose";
import TimeUtil from "../utils/timeUtil";
import { User } from "../models/user/user";
import consoleLog from "../utils/console-log";

/// MongoDB 管理类
export class MongoManagement {
  // 设置数据库连接地址
  private static localDB: string = "mongodb://localhost:27017/file-resource";

  static mongoInit = async () => {
    // MongoDB连接:端口27017,数据库:file-resource
    mongoose
      .connect(MongoManagement.localDB)
      .catch((error) => consoleLog("数据库连接失败,原因", error));

    const connect: Connection = mongoose.connection;

    //监听连接状态
    connect.once("open", () =>
      consoleLog(`MongoDB(${connect.host})连接成功......`)
    );
    connect.once("close", () =>
      consoleLog(`MongoDB(${connect.host})断开......`)
    );
    const adminUser = await User.findOne({ nickname: "admin" });
    if (!adminUser) {
      const timeString: string = new TimeUtil().getNowTimeString();
      const newAdminUser = await User.create({
        nickname: "admin",
        password: "admin",
        phone: "admin",
        createTime: timeString,
        statusCode: 0,
        rightCode: 0,
      });
      consoleLog("添加管理员账户", newAdminUser);
    }
  };
}
