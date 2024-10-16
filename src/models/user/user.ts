import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { defaultAccessAvatar } from "../../config/strings";

interface UserDocument extends Document<mongoose.Types.ObjectId> {
  _id: mongoose.Types.ObjectId;
  memberId: string;
  nickname: string;
  phone: string;
  password: string;
  rightCode: number;
  createTime: string;
}

/// 用户表
const UserSchema: Schema = new Schema({
  // 用户ID
  memberId: {
    type: String,
    // 唯一值
    unique: true,
    //如果没有指定Id，创建默认随机Id
    default: () => uuidv4().substring(0, 8).toUpperCase(),
  },
  avatar: {
    type: String,
    unique: true,
    default: () => defaultAccessAvatar,
  },
  // 用户名
  nickname: {
    type: String,
    unique: true,
    // 如果没有指定用户名，创建默认用户名
    default: `用户_${uuidv4().substring(0, 5)}`,
  },
  password: {
    type: String,
    // 设置密码时，加密密码保存数据库
    set(psw: string) {
      return bcrypt.hashSync(psw, 10);
    },
  },
  phone: { type: String, unique: true },
  // 权限
  /*
  0:超级管理员
  1:管理员
  2:用户
  */
  rightCode: { type: Number, default: 2 },
  // 创建时间
  createTime: { type: String, default: "--" },
});

const User = mongoose.model<UserDocument>("User", UserSchema);
export { UserSchema, User, UserDocument };
