import dotenv from "dotenv";
import routes from "../routes";

dotenv.config();

const mapAppKey = process.env.MAP_APP_KEY;
const kakaoMapApi = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapAppKey}&libraries=services,clusterer,drawing`


// Home
export const home = (req, res) => {
    try {
      res.render("home", { pageTitle: "Home", canonicalUrl: routes.home, kakaoMapApi });
    } catch (error) {
      console.log(`res.render("home") error : ${error}`);
      res.render("home", { pageTitle: "Home", canonicalUrl: routes.home, kakaoMapApi: [] });
    }
};

// People
export const people = (req, res) => {
  try {
    res.render("people", { pageTitle: "People", canonicalUrl: routes.people, kakaoMapApi: [] });
  } catch (error) {
    console.log(`res.render("home") error : ${error}`);
    res.render("people", { pageTitle: "People", canonicalUrl: routes.people });
  }
};
