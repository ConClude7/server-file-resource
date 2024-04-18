import { Router } from "express";
import fileRouter from "./router-file";

const appRouter = Router();

appRouter.use("/file", fileRouter);

export default appRouter;
