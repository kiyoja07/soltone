import express from "express";
import routes from "../routes";
import { home, people } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.people, people);

export default globalRouter;
