import { NextFunction, Request, Response } from "express";

import { User, UserDocument } from "../models/user/user";
import {
  getHeaderUserId,
  getPageQuery,
  getServiceTimeString,
} from "../utils/reqUtil";
import { signToken } from "../utils/tokenUtil";
import brcypt from "bcrypt";
import {
  sendErrorRes,
  sendSuccessPageRes,
  sendSuccessRes,
} from "../common/reponse";
import consoleLog from "../utils/console-log";
import { findPageData } from "../database/pageQueryTool";

export class UserController {
  private static populate: string[] = [];

  /// 删除用户
  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.query.id;
      const user = await User.findOneAndDelete({ _id: userId });
      if (!user) {
        sendErrorRes(res, "无此用户");
        return;
      }
      sendSuccessRes(res);
    } catch (error) {
      next(error);
    }
  };

  /// 查找用户
  static getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryUserId = getHeaderUserId(req);
      const userId = req.query._id;
      const user = await User.findOne({
        _id: userId ?? queryUserId,
      }).populate(this.populate);

      if (!user) {
        sendErrorRes(res, "无此用户");
        return;
      }
      sendSuccessRes(res, user);
    } catch (error) {
      next(error);
    }
  };

  /// 注册用户
  static addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 检查是否已存在相同用户名的用户
      const existingUser = await User.findOne({
        $or: [{ nickname: req.body.nickname }, { phone: req.body.phone }],
      });

      if (existingUser) {
        // 用户名已存在，返回冲突的响应
        sendErrorRes(res, "用户已存在");
        return;
      }
      const timeString: string = getServiceTimeString(req);
      const user: UserDocument = await User.create({
        nickname: req.body.nickname,
        password: req.body.password,
        phone: req.body.phone,
        createTime: timeString,
      });
      consoleLog("创建用户", user);
      const token = signToken(user._id);
      sendSuccessRes(res, {
        _id: user._id,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  /// 修改个人资料
  static edit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryUserId = getHeaderUserId(req);
      const user = await User.findOne({ _id: req.body.id ?? queryUserId });
      if (!user) {
        sendErrorRes(res, "无此用户");
        return;
      }
      if (req.body.nickname) {
        const sameNickName = await User.findOne({
          nickname: req.body.nickname,
        });
        if (sameNickName && `${sameNickName._id}` !== `${user._id}`) {
          sendErrorRes(res, "用户名已存在");
          return;
        }
        await user.updateOne({ nickname: req.body.nickname });
      }
      if (req.body.phone) {
        const sameNickName = await User.findOne({
          phone: req.body.phone,
        });
        if (sameNickName && `${sameNickName._id}` !== `${user._id}`) {
          sendErrorRes(res, "手机号码已存在");
          return;
        }
        await user.updateOne({ phone: req.body.phone });
      }
      if (!isNaN(req.body.rightCode)) {
        await user.updateOne({ rightCode: req.body.rightCode });
      }
      if (req.body.password && req.body.password !== "") {
        await user.updateOne({ password: req.body.password });
      }
      if (req.body.oldPassword) {
        const checkPassword: boolean = brcypt.compareSync(
          req.body.oldPassword,
          user.password
        );
        if (!checkPassword) {
          sendErrorRes(res, "密码不正确");
          return;
        }
        await user.updateOne({ password: req.body.newPassword });
      }
      sendSuccessRes(res, { userId: user._id });
    } catch (error) {
      next(error);
    }
  };

  /// 登陆
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        $or: [{ nickname: req.body.nickname }, { phone: req.body.nickname }],
      });
      if (!user) {
        sendErrorRes(res, "用户不存在");
        return;
      }
      if (req.body.admin) {
        // if (user.rightCode === 2) {
        //   sendErrorRes(res, "权限不足");
        //   return;
        // }
      }
      const checkPassword: boolean = brcypt.compareSync(
        req.body.password,
        user.password
      );
      if (!checkPassword) {
        sendErrorRes(res, "账户名或密码错误");
        return;
      }
      const token = signToken(user._id);
      sendSuccessRes(res, { token: token });
    } catch (error) {
      next(error);
    }
  };

  // 退出登陆
  static logout = async (req: Request, res: Response) => {
    sendSuccessRes(res);
  };

  /// 获取用户列表
  static getUserList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const queryUserId = getHeaderUserId(req);
      const queryUser = await User.findById(queryUserId);
      if (!queryUser) {
        sendErrorRes(res, "无此用户");
        return;
      }

      const filter: any = {};
      if (req.body.rightCode) {
        filter.rightCode = req.body.rightCode;
      }

      const pageQuery = getPageQuery(req);
      const userList = await findPageData<UserDocument>(pageQuery, User, {
        populate: this.populate,
      });
      sendSuccessPageRes(res, pageQuery, userList);
    } catch (error) {
      next(error);
    }
  };
}
