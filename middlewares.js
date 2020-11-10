import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "솔톤 세무";
    res.locals.routes = routes;
    next();
  };