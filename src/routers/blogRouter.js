import express from "express";
import routes from "../routes";
import { blogDetail } from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.get(routes.blogDetail(), blogDetail);

export default blogRouter;
