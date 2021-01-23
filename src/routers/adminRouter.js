import express from "express";
import routes from "../routes";
import { getBlog, requestBlog } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.get(routes.getBlog, requestBlog, getBlog);

export default adminRouter;
