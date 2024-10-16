import { defaultAccessAvatar } from "config/strings";
import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4, v6 as uuidv6 } from "uuid";
import bcrypt from "bcrypt";

interface AccessUserDocument extends Document {
  code: string;
  uid: string;
  avatar: string;
  nickname: string;
  phone: string;
  password: string;
  fileSizes: number;
  createTime: string;
}

const AccessUserSchema: Schema = new Schema({
  code: {
    type: String,
    // 唯一值
    unique: true,
    //如果没有指定Id，创建默认随机Id
    default: () => uuidv4().substring(0, 8).toUpperCase(),
  },
  uid: { type: String, unique: true, default: () => uuidv6() },
  avatar: {
    type: String,
    unique: true,
    default: () => defaultAccessAvatar,
  },
  nickname: {
    type: String,
    unique: true,
    // 如果没有指定用户名，创建默认用户名
    default: `用户_${uuidv4().substring(0, 5)}`,
  },
  phone: { type: String, unique: true },
  password: {
    type: String,
    // 设置密码时，加密密码保存数据库
    set(psw: string) {
      return bcrypt.hashSync(psw, 10);
    },
  },
  fileSizes: { type: Number, default: 0 },
  // 创建时间
  createTime: { type: String, default: "--" },
});

const AccessUser = mongoose.model<AccessUserDocument>(
  "AccessUser",
  AccessUserSchema
);
export { AccessUserSchema, AccessUser, AccessUserDocument };
