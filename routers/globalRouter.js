import express from "express";
import routes from "../routes";
import { home } from "../controllers/imageController";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

export default globalRouter;
