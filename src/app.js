import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import { generateSitemap } from "./sitemap";
import routes from "./routes";
import globalRouter from "./routers/globalRouter";
import blogRouter from "./routers/blogRouter";
import favicon from "serve-favicon";

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet({ contentSecurityPolicy: false }));
app.set("view engine", "pug");
// app.use("/uploads", express.static("uploads"));
// app.use("/static", express.static("static"));
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
    "User-agent: *\nAllow: /\nSitemap: https://soltonetax.com/sitemap.xml"
  );
});

app.use(favicon(path.join(__dirname, "public/images", "favicon.ico")));

// app.get(routes.sitemap, (req, res) => {
//   res.sendFile('/sitemap.xml', { root: __dirname });
// });

app.use(routes.home, globalRouter);
app.use(routes.blogs, blogRouter);
app.get(routes.sitemap, generateSitemap);

app.use(function (req, res, next) {
  res.status(404).redirect(routes.home);
});

export default app;
