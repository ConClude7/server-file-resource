import { UserController } from "../controllers/controller-user";
import { Router } from "express";
export const userRouter = Router();

/* Get请求 */
// 获取用户信息
userRouter.get("/", UserController.getUser);

/* Put请求 */
// 修改用户信息
userRouter.put("/", UserController.edit);

/* Delete请求 */
// 删除用户
userRouter.delete("/", UserController.deleteUser);

/* Post请求 */
// 注册用户信息
userRouter.post("/register", UserController.addUser);
// 用户登录
userRouter.post("/login", UserController.login);
userRouter.post("/logout", UserController.logout);
// 获取用户列表
userRouter.post("/list", UserController.getUserList);
