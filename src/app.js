import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import globalRouter from "./routers/globalRouter";

const app = express();

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

// app.use(routes.home, globalRouter);

import dotenv from "dotenv";
import request from "request";


dotenv.config();


const blogClientID = process.env.NAVER_SEARCH_CLIENT_ID;
const blogClientSECRET = process.env.NAVER_SEARCH_CLIENT_SECRET;

app.get('/', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI("솔톤세무회계"); // json 결과
  // var request = require('request');
  var options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':blogClientID, 'X-Naver-Client-Secret': blogClientSECRET}
   };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
      // console.log(res);
      let json = JSON.parse(body) //json으로 파싱
      console.log(json.items.length);   
      
      for (var key in json.items) { 
        let str = json.items[key].title.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
        console.log(str);
      } 

    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});




export default app;