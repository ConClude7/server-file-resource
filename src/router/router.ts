import { Router } from "express";
import fileRouter from "./router-file";
import { userRouter } from "./userRouter";

const appRouter = Router();

appRouter.use("/file", fileRouter);
appRouter.use("/user", userRouter);

export default appRouter;
