import Image from "../models/Image";
import dotenv from "dotenv";

dotenv.config();

const mapAppKey = process.env.MAP_APP_KEY;
const mapApiKey = process.env.MAP_API_KEY;

// Home
export const home = (req, res) => {
    try {
      res.render("home", { pageTitle: "Home", mapAppKey, mapApiKey });
    } catch (error) {
      console.log(`res.render("home") error : ${error}`);
      res.render("home", { pageTitle: "Home", mapAppKey: [], mapApiKey: [] });
    }
};