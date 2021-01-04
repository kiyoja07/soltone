import dotenv from "dotenv";
import routes from "../routes";

dotenv.config();

const mapAppKey = process.env.MAP_APP_KEY;
const mapApiKey = process.env.MAP_API_KEY;

// Home
export const home = (req, res) => {
    try {
      res.render("home", { pageTitle: "Home", canonicalUrl: routes.home, mapAppKey, mapApiKey });
    } catch (error) {
      console.log(`res.render("home") error : ${error}`);
      res.render("home", { pageTitle: "Home", canonicalUrl: routes.home, mapAppKey: [], mapApiKey: [] });
    }
};

// People
export const people = (req, res) => {
  try {
    res.render("people", { pageTitle: "People", canonicalUrl: routes.people });
  } catch (error) {
    console.log(`res.render("home") error : ${error}`);
    res.render("people", { pageTitle: "People", canonicalUrl: routes.people });
  }
};