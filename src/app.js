import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import globalRouter from "./routers/globalRouter";
import adminRouter from "./routers/adminRouter";

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet({ contentSecurityPolicy: false }));
app.set("view engine", "pug");
// app.use("/uploads", express.static("uploads"));
// app.use("/static", express.static("static"));
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); 
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(localsMiddleware);

app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(
      "User-agent: *\nAllow: /\nDisallow: /admin/\n"
    );
});

app.get(routes.sitemap, (req, res) => {
    res.sendFile('/sitemap.xml', { root : __dirname});
});

app.use(routes.home, globalRouter);
app.use(routes.admin, adminRouter);

export default app;