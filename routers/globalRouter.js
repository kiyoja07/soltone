import express from "express";
import routes from "../routes";
import { home } from "../controllers/imageController";
import {
    getJoin,
    postJoin,
    getLogin,
    postLogin,
} from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin)

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

export default globalRouter;
