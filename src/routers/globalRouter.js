import express from "express";
import routes from "../routes";
import { home, people, blogs, login } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.people, people);
globalRouter.get(routes.blogs, blogs);
// globalRouter.get(routes.login, login);

export default globalRouter;
