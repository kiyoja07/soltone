import express from "express";
import routes from "../routes";
import { vipHome, vipSample } from "../controllers/vipController";

const vipRouter = express.Router();

vipRouter.get(routes.home, vipHome);
vipRouter.get(routes.sample, vipSample);

export default vipRouter;
