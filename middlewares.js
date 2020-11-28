import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "솔톤세무회계";
    res.locals.routes = routes;
    next();
};